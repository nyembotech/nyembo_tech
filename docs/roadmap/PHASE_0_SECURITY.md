# Phase 0: Emergency Security Patches

**Timeline:** Week 1, Days 1-2 (16 hours)  
**Priority:** 🔴 CRITICAL - Production Blocker

---

## Objectives

Stop active security vulnerabilities that could cause data breaches or legal issues.

---

## Task 0.1: Remove Plaintext Password Storage (2h)

**Files to modify:**
- `/types/firestore.ts` (line 32)
- `/services/firebase/seed.ts` (line 14)

### Actions

**1. Remove password field from Customer interface:**

```typescript
// BEFORE (types/firestore.ts)
export interface Customer extends BaseEntity {
    password?: string; // ❌ DELETE THIS
}

// AFTER
export interface Customer extends BaseEntity {
    // No password field - use Firebase Auth only
}
```

**2. Remove plaintext passwords from seed data:**

```typescript
// BEFORE (seed.ts)
{
    password: "password123", // ❌ DELETE
}

// AFTER
{
    // No password field at all
}
```

### Verification

```bash
grep -r "password" types/firestore.ts services/firebase/seed.ts
# Should return no results
```

---

## Task 0.2: Add Emergency API Authentication (4h)

**Create new file:** `/middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

const PROTECTED_ROUTES = [
    '/api/admin',
    '/api/user/export',
    '/api/architect',
];

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
    
    const needsAuth = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    if (!needsAuth) return NextResponse.next();
    
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
            { error: 'Missing authorization token' },
            { status: 401 }
        );
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-user-id', decodedToken.uid);
        requestHeaders.set('x-user-email', decodedToken.email || '');
        
        return NextResponse.next({
            request: { headers: requestHeaders }
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 401 }
        );
    }
}

export const config = {
    matcher: ['/api/:path*'],
};
```

### Update protected routes

**File:** `/app/api/user/export/route.ts`

```typescript
export async function POST(req: Request) {
    const authenticatedUserId = req.headers.get('x-user-id');
    if (!authenticatedUserId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { uid } = await req.json();
    if (uid !== authenticatedUserId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    // ... rest
}
```

### Testing

```bash
# Without token - should return 401
curl http://localhost:3000/api/user/export -X POST

# With invalid token - should return 401
curl http://localhost:3000/api/user/export \
  -H "Authorization: Bearer invalid" -X POST
```

---

## Task 0.3: Patch Critical Firestore Rules (3h)

**File:** `/firestore.rules`

### Fix 1: Restrict project access

```javascript
// AFTER
match /projects/{projectId} {
    allow read: if isAuthenticated() && (
        resource.data.managerId == request.auth.uid ||
        resource.data.customerId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
    );
    allow write: if isAuthenticated() && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
    );
}
```

### Fix 2: Restrict activity logs

```javascript
match /activity_log/{logId} {
    allow read: if isAuthenticated() && (
        resource.data.actorId == request.auth.uid ||
        (resource.data.visibility == 'customer' && 
         resource.data.customerId == request.auth.uid) ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
    );
}
```

### Fix 3: Secure customer invites

```javascript
match /customer_invites/{inviteId} {
    allow read: if isAuthenticated() && (
        request.auth.token.email == resource.data.email ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
    );
    allow update: if isAuthenticated() && 
                     request.auth.token.email == resource.data.email &&
                     resource.data.status == 'pending' &&
                     request.resource.data.status == 'accepted';
}
```

### Deploy

```bash
firebase deploy --only firestore:rules
```

---

## Task 0.4: Add Input Validation (2h)

**File:** `/app/api/agent/route.ts`

```typescript
import { z } from 'zod';

const AgentRequestSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().min(1).max(4000),
    })).min(1).max(50),
    agentType: z.enum(['sales', 'support']),
    userId: z.string().optional().nullable(),
    projectId: z.string().optional().nullable(),
    language: z.enum(['en', 'sw', 'de']),
    sessionId: z.string().uuid(),
});

export async function POST(req: Request) {
    try {
        const rawBody = await req.json();
        const validated = AgentRequestSchema.parse(rawBody);
        // Use validated data
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }
    }
}
```

---

## Task 0.5: Emergency Audit Log (2h)

**Create:** `/lib/security-audit.ts`

```typescript
import { adminDb } from './firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function logSecurityEvent(event: {
    type: 'auth_failure' | 'unauthorized_access' | 'data_export' | 'data_anonymization';
    userId?: string;
    ip?: string;
    details: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}) {
    await adminDb.collection('security_audit_log').add({
        ...event,
        timestamp: FieldValue.serverTimestamp(),
        environment: process.env.NODE_ENV,
    });
}
```

---

## Task 0.6: Add Rate Limiting (3h)

### Install dependencies

```bash
npm install @upstash/ratelimit @upstash/redis
```

### Create `/lib/rate-limit.ts`

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const aiRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    prefix: 'ai_rate_limit',
});

export const apiRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    prefix: 'api_rate_limit',
});
```

---

## Phase 0 Acceptance Criteria

- [ ] No plaintext passwords in codebase
- [ ] API authentication middleware deployed
- [ ] Firestore rules patched for data isolation
- [ ] Input validation on all API routes
- [ ] Security audit logging implemented
- [ ] Rate limiting active

```bash
npm run build  # Should pass
grep -r "password.*string" types/  # No results
curl http://localhost:3000/api/admin/customers/anonymize -X POST  # Returns 401
```
