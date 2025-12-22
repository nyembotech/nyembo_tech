# 🚀 Nyembo Tech Platform Improvement Roadmap
## From C+ (60%) to A- (85%) in 6 Weeks

**Total Timeline:** 6 weeks | **Estimated Effort:** 180-220 hours
**Current Grade:** C+ (60%) | **Target Grade:** A- (85%)

---

## 📊 EXECUTIVE SUMMARY

### Current State Assessment
| Dimension | Current Score | Target | Gap |
|-----------|--------------|--------|-----|
| Security | 40% | 90% | 🔴 Critical |
| Performance | 60% | 90% | 🟡 High |
| Code Quality | 50% | 85% | 🟡 High |
| Test Coverage | 3% | 65% | 🔴 Critical |
| Type Safety | 60% | 95% | 🟡 High |
| Documentation | 30% | 80% | 🟢 Medium |
| Production Readiness | 40% | 90% | 🔴 Critical |

### Key Issues Identified
1. **CRITICAL:** No API authentication - anyone can export user data
2. **CRITICAL:** Plaintext passwords in database schema
3. **CRITICAL:** Multi-tenancy incomplete - data leakage risk
4. **HIGH:** 116MB image assets causing 5-8s load times
5. **HIGH:** No code splitting - 450KB initial bundle
6. **HIGH:** Using expensive AI models unnecessarily (16x cost)
7. **MEDIUM:** Test coverage at 2.7% (5 tests / 187 files)

---

## 📋 PHASE 0: EMERGENCY SECURITY PATCHES
**Timeline:** Week 1, Days 1-2 (16 hours)
**Priority:** 🔴 CRITICAL - Production Blocker

### Task 0.1: Remove Plaintext Password Storage
**Effort:** 2 hours | **Priority:** P0

**Files to Modify:**
- `/types/firestore.ts` (line 32)
- `/services/firebase/seed.ts` (line 14)

**Actions:**
```typescript
// 1. Remove password field from Customer interface
// File: /types/firestore.ts (line 32)
export interface Customer extends BaseEntity {
    // ❌ DELETE: password?: string;
    // Use Firebase Auth only
}

// 2. Remove plaintext passwords from seed data
// File: /services/firebase/seed.ts (line 14)
{
    // ❌ DELETE: password: "password123",
}
```

**Verification:**
```bash
grep -r "password" types/firestore.ts services/firebase/seed.ts
# Should return no results
```

---

### Task 0.2: Add Emergency API Authentication
**Effort:** 4 hours | **Priority:** P0

**Create:** `/middleware.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

// Protected API routes that require authentication
const PROTECTED_ROUTES = [
    '/api/admin',
    '/api/user/export',
    '/api/architect',
];

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Check if route needs protection
    const needsAuth = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    if (!needsAuth) return NextResponse.next();

    // Extract token
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
            { error: 'Missing authorization token' },
            { status: 401 }
        );
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        // Verify Firebase ID token
        const decodedToken = await adminAuth.verifyIdToken(token);

        // Add user info to request headers for downstream use
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

**Update Protected Routes:**

**File:** `/app/api/user/export/route.ts`
```typescript
export async function POST(req: Request) {
    // Get authenticated user from middleware
    const authenticatedUserId = req.headers.get('x-user-id');
    if (!authenticatedUserId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Users can only export their own data
    const { uid } = await req.json();
    if (uid !== authenticatedUserId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Continue with export...
}
```

**File:** `/app/api/admin/customers/anonymize/route.ts`
```typescript
export async function POST(req: Request) {
    const authenticatedUserId = req.headers.get('x-user-id');

    // Verify user is admin
    const userDoc = await adminDb.collection('users').doc(authenticatedUserId).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Continue with anonymization...
}
```

**Testing:**
```bash
# Test without token
curl http://localhost:3000/api/user/export -X POST
# Expected: 401

# Test with invalid token
curl http://localhost:3000/api/user/export \
  -H "Authorization: Bearer invalid" -X POST
# Expected: 401
```

---

### Task 0.3: Patch Critical Firestore Rules
**Effort:** 3 hours | **Priority:** P0

**File:** `/firestore.rules`

**Fix 1: Restrict project access**
```javascript
// BEFORE (line 57-60)
match /projects/{projectId} {
    allow read: if isAuthenticated(); // ❌ ANY user sees ALL projects
}

// AFTER
match /projects/{projectId} {
    allow read: if isAuthenticated() && (
        // User is assigned to project OR is admin
        resource.data.managerId == request.auth.uid ||
        resource.data.customerId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
    );
    allow write: if isAuthenticated() && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
    );
}
```

**Fix 2: Restrict activity logs**
```javascript
// BEFORE (line 152-153)
match /activity_log/{logId} {
    allow read: if isAuthenticated(); // ❌ ANY user sees ALL logs
}

// AFTER
match /activity_log/{logId} {
    allow read: if isAuthenticated() && (
        // User can only see logs they created or logs visible to customers
        resource.data.actorId == request.auth.uid ||
        (resource.data.visibility == 'customer' &&
         resource.data.customerId == request.auth.uid) ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
    );
}
```

**Fix 3: Secure customer invites**
```javascript
// BEFORE (line 167-176)
match /customer_invites/{inviteId} {
    allow read: if true; // ❌ Token enumeration possible
    allow update: if true; // ❌ ANYONE can mark invites as used
}

// AFTER
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

**Deploy:**
```bash
firebase deploy --only firestore:rules
```

---

### Task 0.4: Add Input Validation
**Effort:** 2 hours | **Priority:** P0

**Install Zod:**
```bash
npm install zod
```

**File:** `/app/api/agent/route.ts`
```typescript
import { z } from 'zod';

const AgentRequestSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().min(1).max(4000), // Prevent token bombing
    })).min(1).max(50), // Limit conversation history
    agentType: z.enum(['sales', 'support']),
    userId: z.string().optional().nullable(),
    projectId: z.string().optional().nullable(),
    language: z.enum(['en', 'sw', 'de']),
    sessionId: z.string().uuid(),
});

export async function POST(req: Request) {
    try {
        const rawBody = await req.json();
        const validated = AgentRequestSchema.parse(rawBody); // ✅ Throws on invalid

        const { messages, agentType, userId, projectId, language, sessionId } = validated;
        // Continue...
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
        }
        throw error;
    }
}
```

**File:** `/app/api/translate/route.ts`
```typescript
const TranslateSchema = z.object({
    text: z.string().min(1).max(2000), // Prevent abuse
    from: z.enum(['en', 'sw', 'de']),
    to: z.enum(['en', 'sw', 'de']),
});

export async function POST(req: Request) {
    const validated = TranslateSchema.parse(await req.json());
    // Continue...
}
```

---

### Task 0.5: Add Security Audit Logging
**Effort:** 2 hours | **Priority:** P0

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

**Usage in middleware:**
```typescript
// In middleware.ts catch block
catch (error) {
    await logSecurityEvent({
        type: 'auth_failure',
        ip: req.ip,
        details: `Invalid token: ${error.message}`,
        severity: 'medium',
    });
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
}
```

---

### Task 0.6: Add Rate Limiting
**Effort:** 3 hours | **Priority:** P0

**Install dependencies:**
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Create:** `/lib/rate-limit.ts`
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// AI endpoints: 10 requests per minute per user
export const aiRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    prefix: 'ai_rate_limit',
});

// API endpoints: 100 requests per minute per IP
export const apiRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    prefix: 'api_rate_limit',
});
```

**Update middleware:**
```typescript
// Add before token verification
const ip = req.ip ?? req.headers.get('x-forwarded-for') ?? 'unknown';
const { success, limit, reset, remaining } = await apiRateLimit.limit(ip);

if (!success) {
    return NextResponse.json(
        { error: 'Too many requests', retryAfter: Math.ceil((reset - Date.now()) / 1000) },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) } }
    );
}
```

---

### Phase 0 Deliverables ✅
- [ ] Plaintext passwords removed from codebase
- [ ] API authentication middleware deployed
- [ ] Firestore rules patched for data isolation
- [ ] Input validation added to all API routes
- [ ] Security audit logging implemented
- [ ] Rate limiting active on all endpoints

**Verification Commands:**
```bash
npm run build # Should pass TypeScript checks
grep -r "password.*string" types/ # No results
curl http://localhost:3000/api/admin/customers/anonymize -X POST # Should return 401
```

---

## 🏗️ PHASE 1: CRITICAL SECURITY & INFRASTRUCTURE
**Timeline:** Week 1, Days 3-5 (24 hours)
**Priority:** 🔴 CRITICAL

### Task 1.1: Complete Multi-Tenancy Implementation
**Effort:** 12 hours | **Priority:** P0

**Step 1: Make organizationId required**

**File:** `/types/firestore.ts` (line 11)
```typescript
// BEFORE
export interface BaseEntity {
    id?: string;
    createdAt?: Date | Timestamp;
    updatedAt?: Date | Timestamp;
    organizationId?: string; // ❌ Optional
}

// AFTER
export interface BaseEntity {
    id?: string;
    createdAt?: Date | Timestamp;
    updatedAt?: Date | Timestamp;
    organizationId: string; // ✅ Required
}

// Create exception for global entities
export interface GlobalEntity {
    id?: string;
    createdAt?: Date | Timestamp;
    updatedAt?: Date | Timestamp;
}
```

**Step 2: Update entity interfaces**
```typescript
// Tenant-scoped
export interface Project extends BaseEntity { ... }
export interface Customer extends BaseEntity { ... }
export interface Ticket extends BaseEntity { ... }

// Global
export interface Organization extends GlobalEntity { ... }
export interface SiteContent extends GlobalEntity { ... }
```

**Step 3: Enforce org requirement in auth context**

**File:** `/context/auth-context.tsx` (lines 63-77)
```typescript
// BEFORE (has fallback)
if (userData.organizationId) {
    // ...
} else {
    setOrganization({ id: "default", name: "Nyembotech", ... }); // ❌
}

// AFTER (enforce requirement)
if (!userData.organizationId) {
    console.error("User has no organization assigned:", firebaseUser.uid);
    setError("Account configuration error. Contact support.");
    setUser(null);
    setProfile(null);
    setOrganization(null);
    setLoading(false);
    return;
}

const orgDocRef = doc(db, "organizations", userData.organizationId);
const orgDoc = await getDoc(orgDocRef);

if (!orgDoc.exists()) {
    console.error("Organization not found:", userData.organizationId);
    setError("Invalid organization. Contact support.");
    setUser(null);
    setProfile(null);
    setOrganization(null);
    setLoading(false);
    return;
}

setOrganization({ id: orgDoc.id, ...orgDoc.data() } as Organization);
```

**Step 4: Create org-scoped query helper**

**Create:** `/lib/firestore-helpers.ts`
```typescript
import { Query, where, query, collection as firestoreCollection } from 'firebase/firestore';
import { db } from './firebase';

export function orgScopedQuery<T>(
    collectionName: string,
    organizationId: string,
    ...constraints: any[]
): Query<T> {
    const baseQuery = query(
        firestoreCollection(db, collectionName) as any,
        where('organizationId', '==', organizationId),
        ...constraints
    );
    return baseQuery as Query<T>;
}
```

**Step 5: Update hooks to use org-scoped queries**

**File:** `/hooks/firestore/use-projects.ts`
```typescript
import { useAuth } from '@/context/auth-context';
import { where } from 'firebase/firestore';

export function useProjects(filters: QueryConstraint[] = []) {
    const { organization } = useAuth();

    if (!organization) {
        throw new Error('Cannot query projects without organization context');
    }

    const unsubscribe = subscribeToCollection<Project>(
        "projects",
        [where('organizationId', '==', organization.id), ...filters],
        // ...
    );
}
```

**Apply to:**
- `/hooks/firestore/use-customers.ts`
- `/hooks/firestore/use-tickets.ts`
- `/hooks/firestore/use-knowledge-base.ts`

**Step 6: Update Firestore rules**

**File:** `/firestore.rules`
```javascript
function belongsToUserOrg() {
    return resource.data.organizationId == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.organizationId;
}

match /projects/{projectId} {
    allow read: if isAuthenticated() && belongsToUserOrg();
    allow write: if isAuthenticated() && belongsToUserOrg() && isAdmin();
}

match /customers/{customerId} {
    allow read: if isAuthenticated() && belongsToUserOrg();
    allow write: if isAuthenticated() && belongsToUserOrg() && isAdmin();
}

match /tickets/{ticketId} {
    allow read: if isAuthenticated() && belongsToUserOrg();
    allow create: if isAuthenticated() && request.resource.data.organizationId == getUserOrg();
    allow update: if isAuthenticated() && belongsToUserOrg();
}
```

**Step 7: Data migration script**

**Create:** `/scripts/migrate-multi-tenancy.ts`
```typescript
import { adminDb } from '@/lib/firebase-admin';

async function migrateToMultiTenancy() {
    const DEFAULT_ORG_ID = 'default';

    console.log('Starting multi-tenancy migration...');

    const collections = ['projects', 'customers', 'tickets', 'agent_sessions'];

    for (const collectionName of collections) {
        console.log(`Migrating ${collectionName}...`);

        const snapshot = await adminDb
            .collection(collectionName)
            .where('organizationId', '==', null)
            .get();

        console.log(`Found ${snapshot.size} documents without organizationId`);

        const batch = adminDb.batch();
        let count = 0;

        snapshot.forEach(doc => {
            batch.update(doc.ref, { organizationId: DEFAULT_ORG_ID });
            count++;

            if (count % 500 === 0) {
                console.log(`  Processed ${count} documents...`);
            }
        });

        await batch.commit();
        console.log(`✅ Migrated ${count} ${collectionName}`);
    }

    console.log('Migration complete!');
}

migrateToMultiTenancy().catch(console.error);
```

**Run migration:**
```bash
npx ts-node scripts/migrate-multi-tenancy.ts
```

---

### Task 1.2: Add Composite Firestore Indexes
**Effort:** 2 hours | **Priority:** P0

**File:** `/firestore.indexes.json`
```json
{
    "indexes": [
        {
            "collectionGroup": "projects",
            "queryScope": "COLLECTION",
            "fields": [
                { "fieldPath": "organizationId", "order": "ASCENDING" },
                { "fieldPath": "customerId", "order": "ASCENDING" },
                { "fieldPath": "updatedAt", "order": "DESCENDING" }
            ]
        },
        {
            "collectionGroup": "projects",
            "queryScope": "COLLECTION",
            "fields": [
                { "fieldPath": "organizationId", "order": "ASCENDING" },
                { "fieldPath": "status", "order": "ASCENDING" },
                { "fieldPath": "updatedAt", "order": "DESCENDING" }
            ]
        },
        {
            "collectionGroup": "tickets",
            "queryScope": "COLLECTION",
            "fields": [
                { "fieldPath": "organizationId", "order": "ASCENDING" },
                { "fieldPath": "customerId", "order": "ASCENDING" },
                { "fieldPath": "updatedAt", "order": "DESCENDING" }
            ]
        },
        {
            "collectionGroup": "tickets",
            "queryScope": "COLLECTION",
            "fields": [
                { "fieldPath": "organizationId", "order": "ASCENDING" },
                { "fieldPath": "status", "order": "ASCENDING" },
                { "fieldPath": "updatedAt", "order": "DESCENDING" }
            ]
        },
        {
            "collectionGroup": "agent_sessions",
            "queryScope": "COLLECTION",
            "fields": [
                { "fieldPath": "organizationId", "order": "ASCENDING" },
                { "fieldPath": "userId", "order": "ASCENDING" },
                { "fieldPath": "createdAt", "order": "DESCENDING" }
            ]
        }
    ],
    "fieldOverrides": []
}
```

**Deploy:**
```bash
firebase deploy --only firestore:indexes
# Indexes take 5-15 minutes to build
```

---

### Task 1.3: Replace Mock Data with Real Queries
**Effort:** 6 hours | **Priority:** P1

**File:** `/hooks/use-portal-data.ts`

```typescript
// DELETE entire mock data block (lines 44-94)

// REPLACE WITH:
import { useAuth } from '@/context/auth-context';
import { useProjects } from './firestore/use-projects';
import { useTickets } from './firestore/use-tickets';
import { db } from '@/lib/firebase';
import { doc, getDoc, where, orderBy, limit } from 'firebase/firestore';

export function usePortalData() {
    const { user, profile } = useAuth();
    const [data, setData] = useState<PortalData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { data: projects, loading: projectsLoading } = useProjects([
        where('customerId', '==', user?.uid || '')
    ]);

    const { data: tickets, loading: ticketsLoading } = useTickets([
        where('customerId', '==', user?.uid || ''),
        orderBy('createdAt', 'desc'),
        limit(5)
    ]);

    useEffect(() => {
        if (!user || !profile) {
            setLoading(false);
            return;
        }

        async function loadData() {
            try {
                const customerDoc = await getDoc(doc(db, 'customers', user.uid));
                const customerData = customerDoc.data();

                setData({
                    customerName: profile.displayName || customerData?.name || 'User',
                    projects: projects || [],
                    recentTickets: tickets || [],
                    supportCoverage: calculateSupportCoverage(projects || []),
                    quickActions: generateQuickActions(projects || [], tickets || []),
                });
            } catch (err) {
                console.error('Failed to load portal data:', err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        }

        if (!projectsLoading && !ticketsLoading) {
            loadData();
        }
    }, [user, profile, projects, tickets, projectsLoading, ticketsLoading]);

    return { data, loading, error };
}
```

**File:** `/app/[locale]/admin/page.tsx` (lines 91-104)

```typescript
// DELETE hardcoded map (lines 91-104)

// REPLACE WITH:
import { useProjects } from '@/hooks/firestore/use-projects';
import { orderBy, limit } from 'firebase/firestore';

export default function AdminDashboard() {
    const { data: projects, loading } = useProjects([
        orderBy('updatedAt', 'desc'),
        limit(10)
    ]);

    if (loading) return <ProjectsSkeleton />;

    return (
        <div>
            {projects?.map(project => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
}
```

---

### Task 1.4: Standardize Error Responses
**Effort:** 4 hours | **Priority:** P1

**Create:** `/lib/api-response.ts`
```typescript
import { NextResponse } from 'next/server';

export interface ApiError {
    error: string;
    code?: string;
    details?: Record<string, any>;
    timestamp: string;
}

export interface ApiSuccess<T = any> {
    data: T;
    timestamp: string;
}

export class ApiResponse {
    static success<T>(data: T, status: number = 200): NextResponse<ApiSuccess<T>> {
        return NextResponse.json(
            { data, timestamp: new Date().toISOString() },
            { status }
        );
    }

    static error(
        message: string,
        status: number = 500,
        code?: string,
        details?: Record<string, any>
    ): NextResponse<ApiError> {
        return NextResponse.json(
            {
                error: message,
                code,
                details,
                timestamp: new Date().toISOString(),
            },
            { status }
        );
    }

    static badRequest(message: string, details?: Record<string, any>) {
        return this.error(message, 400, 'BAD_REQUEST', details);
    }

    static unauthorized(message: string = 'Unauthorized') {
        return this.error(message, 401, 'UNAUTHORIZED');
    }

    static forbidden(message: string = 'Forbidden') {
        return this.error(message, 403, 'FORBIDDEN');
    }

    static notFound(message: string = 'Resource not found') {
        return this.error(message, 404, 'NOT_FOUND');
    }

    static serverError(message: string = 'Internal server error') {
        return this.error(message, 500, 'INTERNAL_ERROR');
    }
}
```

**Update all API routes:**
```typescript
// Example: /app/api/agent/route.ts
import { ApiResponse } from '@/lib/api-response';

if (!agentType) {
    return ApiResponse.badRequest("Agent type is required", {
        allowed: ['sales', 'support']
    });
}

// In catch block
catch (error) {
    if (error instanceof z.ZodError) {
        return ApiResponse.badRequest("Invalid request data", {
            errors: error.errors
        });
    }
    return ApiResponse.serverError();
}
```

**Apply to:**
- `/app/api/translate/route.ts`
- `/app/api/architect/route.ts`
- `/app/api/insights/route.ts`
- `/app/api/user/export/route.ts`
- `/app/api/admin/customers/anonymize/route.ts`

---

### Phase 1 Deliverables ✅
- [ ] `organizationId` required on all tenant-scoped entities
- [ ] All database queries filter by `organizationId`
- [ ] Firestore rules enforce data isolation
- [ ] Composite indexes deployed
- [ ] Mock data replaced with real queries
- [ ] All API routes return standardized JSON
- [ ] Migration script executed successfully

---

## ⚡ PHASE 2: PERFORMANCE QUICK WINS
**Timeline:** Week 2, Days 1-3 (24 hours)
**Priority:** 🟡 HIGH

### Task 2.1: Image Optimization Blitz
**Effort:** 4 hours | **Priority:** P0

**Install tools:**
```bash
npm install -D @squoosh/cli sharp
```

**Create conversion script:**

**File:** `/scripts/optimize-images.sh`
```bash
#!/bin/bash

# Find all PNG files larger than 1MB and convert
find public/assets/images -name "*.png" -size +1M -exec \
    npx @squoosh/cli --webp 80 --resize '{"enabled": true, "width": 1920}' {} \;

# Remove original large PNGs
find public/assets/images -name "*.png" -size +5M -delete

echo "Image optimization complete!"
```

**Run:**
```bash
chmod +x scripts/optimize-images.sh
./scripts/optimize-images.sh
```

**Create optimized image component:**

**File:** `/components/ui/optimized-image.tsx`
```typescript
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
    src: string;
    alt: string;
}

export function OptimizedImage({ src, alt, ...props }: OptimizedImageProps) {
    const webpSrc = src.replace(/\.png$/, '.webp');

    return (
        <Image
            src={webpSrc}
            alt={alt}
            {...props}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
    );
}
```

**Expected Savings:** -110MB total, LCP -2s

---

### Task 2.2: Implement Code Splitting
**Effort:** 8 hours | **Priority:** P0

**Lazy load AI chat widget:**

**File:** `/app/[locale]/layout.tsx`
```typescript
import dynamic from 'next/dynamic';

const PublicAgentWrapper = dynamic(
    () => import('@/components/ai/public-agent-wrapper').then(m => ({
        default: m.PublicAgentWrapper
    })),
    {
        ssr: false,
        loading: () => null,
    }
);
```

**Lazy load admin components:**

**File:** `/app/[locale]/admin/page.tsx`
```typescript
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const AIInsightsPanel = dynamic(
    () => import('@/components/ai/ai-insights-panel').then(m => ({
        default: m.AIInsightsPanel
    })),
    { loading: () => <Skeleton className="h-64 w-full" /> }
);

const AnalyticsCharts = dynamic(
    () => import('@/components/admin/analytics/charts').then(m => ({
        default: m.AnalyticsCharts
    })),
    { loading: () => <div className="h-96 animate-pulse bg-gray-200" /> }
);

const KanbanBoard = dynamic(
    () => import('@/components/admin/kanban/board').then(m => ({
        default: m.KanbanBoard
    })),
    { loading: () => <Skeleton className="h-screen w-full" /> }
);
```

**Add loading states:**

**Create:** `/app/[locale]/admin/loading.tsx`
```typescript
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
    return (
        <div className="space-y-6 p-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    );
}
```

**Enable package optimization:**

**File:** `/next.config.ts`
```typescript
const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: [
            'lucide-react',
            '@radix-ui/react-accordion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            'framer-motion',
        ],
    },
};
```

**Expected Savings:** -150KB bundle, TTI -1.5s

---

### Task 2.3: Replace Framer Motion with CSS
**Effort:** 8 hours | **Priority:** P1

**Add CSS animations:**

**File:** `/app/globals.css`
```css
/* Replace Framer Motion with CSS animations */
@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes scale-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}

.animate-fade-in-up {
    animation: fade-in-up 0.5s ease-out;
}

.animate-scale-in {
    animation: scale-in 0.3s ease-out;
}

.animate-delay-100 { animation-delay: 100ms; }
.animate-delay-200 { animation-delay: 200ms; }
.animate-delay-300 { animation-delay: 300ms; }
```

**Replace in components:**

**File:** `/components/home-page-client.tsx`
```typescript
// BEFORE
import { motion } from "framer-motion";

<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
>
    <h1>Welcome</h1>
</motion.div>

// AFTER
<div className="animate-fade-in-up">
    <h1>Welcome</h1>
</div>
```

**Expected Savings:** -60KB, INP -100ms

---

### Task 2.4: Optimize Firebase Initialization
**Effort:** 4 hours | **Priority:** P1

**Create lazy-loaded Firebase modules:**

**File:** `/lib/firebase-client.ts`
```typescript
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

let auth: Auth | null = null;

export async function getFirebaseAuth() {
    if (auth) return auth;

    const { initializeApp, getApps, getApp } = await import('firebase/app');
    const { getAuth } = await import('firebase/auth');

    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    };

    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);

    return auth;
}
```

**Expected Savings:** -30KB on public pages

---

### Phase 2 Deliverables ✅
- [ ] All images converted to WebP (<1MB)
- [ ] Code splitting for admin/portal routes
- [ ] Framer Motion replaced with CSS (80%+)
- [ ] Firebase lazy loaded
- [ ] Bundle <200KB initial
- [ ] Lighthouse score >85

---

## 🔒 PHASE 3: CODE QUALITY & TYPE SAFETY
**Timeline:** Week 2, Days 4-5 (16 hours)
**Priority:** 🟡 HIGH

### Task 3.1: Eliminate `any` Types
**Effort:** 6 hours | **Priority:** P1

**Create proper type definitions:**

**File:** `/types/api.ts` (new)
```typescript
import { Message } from 'ai';

export interface ChatCompletion {
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    finishReason?: 'stop' | 'length' | 'content_filter' | 'function_call';
}

export interface AgentRequest {
    messages: Message[];
    agentType: 'sales' | 'support';
    userId?: string;
    projectId?: string;
    language: 'en' | 'sw' | 'de';
    sessionId: string;
}

export interface UserProfile {
    displayName: string;
    email: string;
    photoURL?: string;
    role: 'admin' | 'staff' | 'customer';
    organizationId: string;
    createdAt: Date;
    updatedAt: Date;
}
```

**Fix type casts:**

**File:** `/app/api/agent/route.ts` (line 121)
```typescript
// BEFORE
const usage = (completion.usage as any)?.completionTokens || 0;

// AFTER
import { ChatCompletion } from '@/types/api';
const completion: ChatCompletion = result;
const usage = completion.usage?.completionTokens ?? 0;
```

**File:** `/hooks/use-chat-agent.ts` (line 24)
```typescript
// BEFORE
const chat: any = useChat({...} as any);

// AFTER
import { UseChatOptions } from 'ai/react';

const chatConfig: UseChatOptions = {
    api: `/api/agent`,
    body: {
        agentType: type,
        userId: userId || null,
        projectId: projectId || null,
        language: locale,
        sessionId: sessionId,
    },
};
const chat = useChat(chatConfig);
```

**File:** `/context/auth-context.tsx` (line 24)
```typescript
// BEFORE
const [profile, setProfile] = useState<any | null>(null);

// AFTER
import { UserProfile } from '@/types/api';
const [profile, setProfile] = useState<UserProfile | null>(null);
```

**Enable stricter TypeScript:**

**File:** `/tsconfig.json`
```json
{
    "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noImplicitReturns": true
    }
}
```

**Run type checker:**
```bash
npx tsc --noEmit
# Fix all errors
```

---

### Task 3.2: Fix Code Duplication
**Effort:** 5 hours | **Priority:** P1

**Extract health check logic:**

**File:** `/app/api/health/route.ts`
```typescript
interface ServiceStatus {
    status: 'ok' | 'error';
    message?: string;
    latency?: number;
}

async function checkService(
    name: string,
    check: () => Promise<void>
): Promise<ServiceStatus> {
    const start = Date.now();
    try {
        await check();
        return {
            status: 'ok',
            latency: Math.round(Date.now() - start),
        };
    } catch (e: any) {
        return {
            status: 'error',
            message: e.message,
        };
    }
}

export async function GET() {
    const status = {
        overall: 'healthy' as 'healthy' | 'degraded',
        timestamp: new Date().toISOString(),
        firestore: await checkService('firestore', async () => {
            await adminDb.collection("_health_check").doc("test").get();
        }),
        auth: await checkService('auth', async () => {
            await adminAuth.getUser('nonexistent');
        }),
        openai: await checkService('openai', async () => {
            if (!process.env.OPENAI_API_KEY) throw new Error('No API key');
        }),
    };

    const hasErrors = Object.values(status).some(
        (s) => typeof s === 'object' && s.status === 'error'
    );
    if (hasErrors) status.overall = 'degraded';

    return NextResponse.json(status, {
        status: status.overall === 'healthy' ? 200 : 503
    });
}
```

**Create error handler:**

**File:** `/lib/error-handler.ts`
```typescript
import { ZodError } from 'zod';
import { FirebaseError } from 'firebase/app';
import { ApiResponse } from './api-response';

export function handleApiError(error: unknown) {
    console.error('API Error:', error);

    if (error instanceof ZodError) {
        return ApiResponse.badRequest('Invalid input', { errors: error.errors });
    }

    if (error instanceof FirebaseError) {
        switch (error.code) {
            case 'permission-denied':
                return ApiResponse.forbidden('Access denied');
            case 'not-found':
                return ApiResponse.notFound('Resource not found');
            case 'unauthenticated':
                return ApiResponse.unauthorized();
            default:
                return ApiResponse.serverError('Database error');
        }
    }

    return ApiResponse.serverError();
}
```

**Apply to all routes:**
```typescript
export async function POST(req: Request) {
    try {
        const validated = Schema.parse(await req.json());
        const result = await processRequest(validated);
        return ApiResponse.success(result);
    } catch (error) {
        return handleApiError(error);
    }
}
```

---

### Phase 3 Deliverables ✅
- [ ] Zero `any` types (verified with `tsc --noEmit`)
- [ ] TypeScript strict mode enabled
- [ ] Health check refactored (DRY)
- [ ] Consistent error handling
- [ ] Code duplication reduced 60%+

---

## 🧪 PHASE 4: TESTING & ERROR HANDLING
**Timeline:** Week 3, Days 1-3 (24 hours)
**Priority:** 🟡 HIGH

### Task 4.1: Unit Testing Infrastructure
**Effort:** 8 hours | **Priority:** P1

**Install dependencies:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui @vitest/coverage-v8
```

**Create:** `/vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            thresholds: {
                lines: 60,
                functions: 60,
                branches: 60,
                statements: 60,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
});
```

**Create:** `/tests/setup.ts`
```typescript
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
    cleanup();
});

// Mock Firebase
vi.mock('@/lib/firebase', () => ({
    db: {},
    auth: {},
}));

vi.mock('@/lib/firebase-admin', () => ({
    adminDb: {},
    adminAuth: {},
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
}));
```

**Update package.json:**
```json
{
    "scripts": {
        "test": "vitest",
        "test:ui": "vitest --ui",
        "test:coverage": "vitest --coverage",
        "test:run": "vitest run"
    }
}
```

---

### Task 4.2: Write Critical Service Tests
**Effort:** 8 hours | **Priority:** P0

**Create:** `/tests/services/ai-context.test.ts`
```typescript
import { describe, it, expect, vi } from 'vitest';
import { getAgentContext } from '@/services/ai/context';

describe('AI Context Service', () => {
    it('should generate sales context in English', async () => {
        const context = await getAgentContext('sales', { language: 'en' });
        expect(context).toContain('Nyembo Guide');
        expect(context).toContain('English');
    });

    it('should require userId for support agent', async () => {
        await expect(
            getAgentContext('support', { language: 'en' })
        ).rejects.toThrow('userId required');
    });
});
```

**Create:** `/tests/services/database.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { createDocument, updateDocument } from '@/services/firebase/database';

describe('Database Service', () => {
    it('should add timestamps automatically', async () => {
        // Test implementation
    });

    it('should enforce organizationId', async () => {
        const data = { name: 'Project' };
        await expect(
            createDocument('projects', data)
        ).rejects.toThrow('organizationId required');
    });
});
```

---

### Task 4.3: Add Error Boundaries
**Effort:** 4 hours | **Priority:** P1

**Create:** `/components/error-boundary.tsx`
```typescript
'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
                    <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-4 text-center max-w-md">
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                    <Button
                        onClick={() => {
                            this.setState({ hasError: false, error: null });
                            window.location.reload();
                        }}
                    >
                        Reload Page
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}
```

**Add to layouts:**
```typescript
// app/[locale]/layout.tsx
import { ErrorBoundary } from '@/components/error-boundary';

export default function RootLayout({ children }) {
    return (
        <ErrorBoundary>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ErrorBoundary>
    );
}
```

---

### Phase 4 Deliverables ✅
- [ ] Vitest configured with 60%+ coverage target
- [ ] Unit tests for critical services
- [ ] Component tests for key features
- [ ] Error boundaries implemented
- [ ] Test suite passes

---

## 🏛️ PHASE 5: ARCHITECTURE REFINEMENT
**Timeline:** Week 3, Days 4-5 (16 hours)
**Priority:** 🟢 MEDIUM

### Task 5.1: Implement Pagination
**Effort:** 6 hours | **Priority:** P1

**Create:** `/hooks/use-paginated-query.ts`
```typescript
import { useState, useEffect, useCallback } from 'react';
import { QueryConstraint, DocumentSnapshot, limit, startAfter, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { collection as firestoreCollection } from 'firebase/firestore';

export interface PaginationState<T> {
    data: T[];
    loading: boolean;
    error: Error | null;
    hasMore: boolean;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
}

export function usePaginatedQuery<T>(
    collectionName: string,
    constraints: QueryConstraint[] = [],
    pageSize: number = 25
): PaginationState<T> {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState(true);

    const loadPage = useCallback(async (lastDocument: DocumentSnapshot | null = null) => {
        try {
            setLoading(true);

            const baseQuery = query(
                firestoreCollection(db, collectionName),
                ...constraints,
                limit(pageSize + 1)
            );

            const paginatedQuery = lastDocument
                ? query(baseQuery, startAfter(lastDocument))
                : baseQuery;

            const snapshot = await getDocs(paginatedQuery);
            const docs = snapshot.docs.slice(0, pageSize);
            const hasMoreDocs = snapshot.docs.length > pageSize;

            const items = docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as T[];

            if (lastDocument) {
                setData(prev => [...prev, ...items]);
            } else {
                setData(items);
            }

            setLastDoc(docs[docs.length - 1] || null);
            setHasMore(hasMoreDocs);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [collectionName, constraints, pageSize]);

    const loadMore = useCallback(async () => {
        if (!hasMore || loading) return;
        await loadPage(lastDoc);
    }, [hasMore, loading, lastDoc, loadPage]);

    const refresh = useCallback(async () => {
        setLastDoc(null);
        setHasMore(true);
        await loadPage(null);
    }, [loadPage]);

    useEffect(() => {
        loadPage();
    }, [loadPage]);

    return { data, loading, error, hasMore, loadMore, refresh };
}
```

**Update hooks:**
```typescript
// hooks/firestore/use-customers.ts
import { usePaginatedQuery } from '@/hooks/use-paginated-query';

export function useCustomers() {
    const { organization } = useAuth();

    return usePaginatedQuery<Customer>(
        'customers',
        [
            where('organizationId', '==', organization?.id),
            orderBy('name', 'asc'),
        ],
        25
    );
}
```

---

### Task 5.2: Optimize Database Queries (Fix N+1)
**Effort:** 5 hours | **Priority:** P0

**File:** `/services/ai/context.ts`
```typescript
// BEFORE (Sequential)
const userDoc = await adminDb.collection("users").doc(userId).get();
const projectsSnap = await adminDb.collection("projects").where("customerId", "==", userId).get();
const ticketsSnap = await adminDb.collection("tickets").where("customerId", "==", userId).get();

// AFTER (Parallel - 3x faster)
const [userDoc, projectsSnap, ticketsSnap] = await Promise.all([
    adminDb.collection("users").doc(userId).get(),
    adminDb.collection("projects")
        .where("customerId", "==", userId)
        .where("organizationId", "==", organizationId)
        .limit(10)
        .get(),
    adminDb.collection("tickets")
        .where("customerId", "==", userId)
        .where("organizationId", "==", organizationId)
        .orderBy("createdAt", "desc")
        .limit(5)
        .get(),
]);
```

---

### Task 5.3: Remove Dead Features
**Effort:** 3 hours | **Priority:** P2

**Remove Matches feature:**
```bash
# Delete from types
# File: /types/firestore.ts - DELETE Match interface

# Delete routes/components
rm -rf app/[locale]/matches/
rm -rf components/matches/
```

**Archive Smart Spaces:**
```bash
git checkout -b archive/smart-spaces
mkdir -p archive/smart-spaces
git mv components/smart-spaces/ archive/smart-spaces/
git mv app/[locale]/smart-spaces/ archive/smart-spaces/
git commit -m "Archive Smart Spaces for future"
git checkout main
```

---

### Phase 5 Deliverables ✅
- [ ] Pagination on all list views
- [ ] N+1 queries eliminated
- [ ] Matches feature removed
- [ ] Smart Spaces archived
- [ ] All queries have limits

---

## 🤖 PHASE 6: AI OPTIMIZATION & CACHING
**Timeline:** Week 4, Days 1-2 (16 hours)
**Priority:** 🟢 MEDIUM

### Task 6.1: Switch to Cost-Efficient Models
**Effort:** 2 hours | **Priority:** P0

**File:** `/app/api/insights/route.ts`
```typescript
// BEFORE (Expensive)
model: openai("gpt-4o"),

// AFTER (16x cheaper!)
model: openai("gpt-4o-mini"),
```

**Expected Savings:** 85% reduction in AI costs

---

### Task 6.2: Implement Context Caching
**Effort:** 8 hours | **Priority:** P0

**Install:**
```bash
npm install node-cache
```

**Create:** `/lib/cache.ts`
```typescript
import NodeCache from 'node-cache';

class CacheService {
    private cache: NodeCache;

    constructor() {
        this.cache = new NodeCache({
            stdTTL: 600, // 10 minutes default
            checkperiod: 120,
            useClones: false,
        });
    }

    async get<T>(key: string): Promise<T | null> {
        const value = this.cache.get<T>(key);
        return value ?? null;
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        if (ttl) {
            this.cache.set(key, value, ttl);
        } else {
            this.cache.set(key, value);
        }
    }

    async wrap<T>(
        key: string,
        fn: () => Promise<T>,
        ttl?: number
    ): Promise<T> {
        const cached = await this.get<T>(key);
        if (cached !== null) return cached;

        const result = await fn();
        await this.set(key, result, ttl);
        return result;
    }
}

export const cache = new CacheService();
```

**Use in AI context:**
```typescript
// services/ai/context.ts
import { cache } from '@/lib/cache';

export async function getAgentContext(type: AgentType, params: AgentContextParams = {}) {
    if (type === 'sales') {
        const cacheKey = `sales_context:${params.language}`;
        return cache.wrap(cacheKey, () => getSalesContext(params.language), 3600);
    }
    // ...
}
```

**Expected Savings:** 80% reduction in Firestore reads

---

### Task 6.3: Translation Caching
**Effort:** 3 hours | **Priority:** P1

**File:** `/app/api/translate/route.ts`
```typescript
import { cache } from '@/lib/cache';
import crypto from 'crypto';

function getTranslationCacheKey(text: string, from: string, to: string): string {
    const hash = crypto.createHash('md5').update(text).digest('hex');
    return `translation:${from}:${to}:${hash}`;
}

export async function POST(req: Request) {
    const { text, from, to } = validated;

    const cacheKey = getTranslationCacheKey(text, from, to);
    const cached = await cache.get<string>(cacheKey);

    if (cached) {
        return ApiResponse.success({
            translatedText: cached,
            from,
            to,
            cached: true,
        });
    }

    const result = await generateText({...});

    // Cache permanently
    await cache.set(cacheKey, result.text, 0);

    return ApiResponse.success({
        translatedText: result.text,
        from,
        to,
        cached: false,
    });
}
```

**Expected Savings:** 95%+ for repeated translations

---

### Phase 6 Deliverables ✅
- [ ] Insights using gpt-4o-mini
- [ ] AI context caching (80% fewer DB reads)
- [ ] Translation caching (95% fewer API calls)
- [ ] Agent response caching

---

## 📚 PHASE 7: DOCUMENTATION & MONITORING
**Timeline:** Week 4, Days 3-5 (24 hours)
**Priority:** 🟢 MEDIUM

### Task 7.1: API Documentation
**Effort:** 8 hours | **Priority:** P1

**Install:**
```bash
npm install -D swagger-jsdoc swagger-ui-react
```

**Create:** `/app/api-docs/page.tsx`
```typescript
'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocsPage() {
    return (
        <div className="container mx-auto py-8">
            <SwaggerUI url="/api/openapi.json" />
        </div>
    );
}
```

**Create OpenAPI spec:**

**File:** `/app/api/openapi.json/route.ts`
```typescript
import { NextResponse } from 'next/server';

const openApiSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Nyembo Tech API',
        version: '1.0.0',
        description: 'API documentation for Nyembo Tech platform',
    },
    paths: {
        '/api/agent': {
            post: {
                summary: 'Chat with AI agent',
                tags: ['AI Agents'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['messages', 'agentType', 'sessionId', 'language'],
                                properties: {
                                    messages: { type: 'array' },
                                    agentType: { type: 'string', enum: ['sales', 'support'] },
                                    sessionId: { type: 'string', format: 'uuid' },
                                    language: { type: 'string', enum: ['en', 'sw', 'de'] },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Streaming response' },
                    '400': { description: 'Invalid request' },
                    '429': { description: 'Rate limit exceeded' },
                },
            },
        },
    },
};

export async function GET() {
    return NextResponse.json(openApiSpec);
}
```

---

### Task 7.2: Add JSDoc Comments
**Effort:** 6 hours | **Priority:** P2

**Example:**
```typescript
/**
 * Generates system context for AI agents.
 *
 * @param type - Agent type: "sales" or "support"
 * @param params - Context parameters
 * @param params.userId - Required for support agents
 * @param params.language - Target language, defaults to "en"
 * @returns System prompt for LLM
 * @throws {Error} If support agent called without userId
 *
 * @example
 * const context = await getAgentContext('sales', { language: 'sw' });
 */
export async function getAgentContext(type: AgentType, params: AgentContextParams = {}) {
    // ...
}
```

---

### Task 7.3: Implement Monitoring
**Effort:** 6 hours | **Priority:** P1

**Install Sentry:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Configure:**
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
});
```

**Create metrics service:**

**File:** `/lib/metrics.ts`
```typescript
import { adminDb } from './firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export interface MetricEvent {
    name: string;
    value: number;
    unit: 'ms' | 'count' | 'bytes';
    metadata?: Record<string, any>;
}

class MetricsService {
    async track(event: MetricEvent) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[METRIC] ${event.name}:`, event.value, event.unit);
            return;
        }

        await adminDb.collection('metrics').add({
            ...event,
            timestamp: FieldValue.serverTimestamp(),
        });
    }

    async trackDuration(name: string, durationMs: number, metadata?: Record<string, any>) {
        await this.track({ name, value: durationMs, unit: 'ms', metadata });
    }
}

export const metrics = new MetricsService();
```

---

### Task 7.4: Create Deployment Checklist
**Effort:** 4 hours | **Priority:** P1

**Create:** `/docs/DEPLOYMENT.md`
```markdown
# Deployment Checklist

## Pre-Deployment

### Security
- [ ] All API routes have authentication
- [ ] Firestore rules deployed
- [ ] Environment variables secured
- [ ] Rate limiting configured

### Performance
- [ ] Images optimized
- [ ] Bundle size <200KB
- [ ] Lighthouse score >85

### Code Quality
- [ ] TypeScript strict passing
- [ ] All tests passing
- [ ] Coverage >60%

## Deployment Steps

1. Connect to Vercel: `vercel`
2. Configure environment variables
3. Deploy: `vercel --prod`
4. Verify health check: `curl https://domain.com/api/health`

## Post-Deployment

- Monitor Sentry for errors
- Check API response times
- Review token usage
```

---

### Phase 7 Deliverables ✅
- [ ] API docs at `/api-docs`
- [ ] README updated
- [ ] JSDoc on critical functions
- [ ] Sentry configured
- [ ] Metrics dashboard
- [ ] Deployment checklist

---

## 🎯 PHASE 8: FINAL POLISH & PRODUCTION PREP
**Timeline:** Week 5-6 (40 hours)
**Priority:** 🟢 MEDIUM

### Task 8.1: Accessibility Audit
**Effort:** 8 hours | **Priority:** P1

**Install:**
```bash
npm install -D @axe-core/react eslint-plugin-jsx-a11y
```

**Add ARIA labels:**
```typescript
<button
    onClick={openChat}
    aria-label="Open chat with AI assistant"
    aria-expanded={isOpen}
>
    <MessageCircle />
</button>
```

**Fix keyboard navigation:**
```typescript
<div
    role="button"
    tabIndex={0}
    onClick={handleClick}
    onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
        }
    }}
>
    Custom Button
</div>
```

---

### Task 8.2: SEO Optimization
**Effort:** 4 hours | **Priority:** P2

**File:** `/app/[locale]/layout.tsx`
```typescript
export const metadata: Metadata = {
    title: {
        default: 'Nyembo Tech - AI-Powered Client Portal',
        template: '%s | Nyembo Tech',
    },
    description: 'AI-native client portal for growing agencies',
    openGraph: {
        type: 'website',
        title: 'Nyembo Tech',
        description: 'AI-powered client management',
        images: ['/assets/images/og-image.png'],
    },
};
```

**Create sitemap:**
```typescript
// app/sitemap.ts
export default function sitemap() {
    return [
        {
            url: 'https://nyembotech.com',
            lastModified: new Date(),
            priority: 1,
        },
    ];
}
```

---

### Task 8.3: Security Hardening
**Effort:** 8 hours | **Priority:** P0

**Add security headers:**

**File:** `/next.config.ts`
```typescript
const nextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                ],
            },
        ];
    },
};
```

**Run security audit:**
```bash
npm audit
npm audit fix
```

---

### Task 8.4: Load Testing
**Effort:** 6 hours | **Priority:** P2

**Install:**
```bash
npm install -D k6
```

**Create:** `/tests/load/agent-api.js`
```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
    stages: [
        { duration: '1m', target: 10 },
        { duration: '3m', target: 10 },
        { duration: '1m', target: 50 },
        { duration: '3m', target: 50 },
        { duration: '1m', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'],
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {
    const payload = JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        agentType: 'sales',
        sessionId: crypto.randomUUID(),
        language: 'en',
    });

    const res = http.post('http://localhost:3000/api/agent', payload, {
        headers: { 'Content-Type': 'application/json' },
    });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 2s': (r) => r.timings.duration < 2000,
    });
}
```

**Run:**
```bash
k6 run tests/load/agent-api.js
```

---

### Task 8.5: Backup Plan
**Effort:** 4 hours | **Priority:** P1

**Create:** `/scripts/backup-firestore.ts`
```typescript
import { adminDb } from '@/lib/firebase-admin';
import fs from 'fs';
import path from 'path';

async function backupFirestore() {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupDir = path.join(process.cwd(), 'backups', timestamp);

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const collections = ['users', 'organizations', 'projects', 'customers', 'tickets'];

    for (const collectionName of collections) {
        console.log(`Backing up ${collectionName}...`);

        const snapshot = await adminDb.collection(collectionName).get();
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        fs.writeFileSync(
            path.join(backupDir, `${collectionName}.json`),
            JSON.stringify(data, null, 2)
        );

        console.log(`✅ Backed up ${data.length} ${collectionName}`);
    }

    console.log(`\n🎉 Backup complete: ${backupDir}`);
}

backupFirestore().catch(console.error);
```

**Add to package.json:**
```json
{
    "scripts": {
        "backup": "ts-node scripts/backup-firestore.ts"
    }
}
```

---

### Task 8.6: Final QA Checklist
**Effort:** 6 hours | **Priority:** P0

**Create:** `/docs/QA_CHECKLIST.md`
```markdown
# QA Checklist

## Functional Testing
- [ ] User can sign up
- [ ] User can log in
- [ ] Projects list loads
- [ ] Can create project
- [ ] AI agent responds
- [ ] Rate limiting works

## Performance
- [ ] Lighthouse >85
- [ ] LCP <2.5s
- [ ] Bundle <200KB

## Security
- [ ] API routes require auth
- [ ] Users see only their org data
- [ ] XSS prevented

## Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
```

---

### Phase 8 Deliverables ✅
- [ ] Accessibility audit passed
- [ ] SEO optimized
- [ ] Security headers implemented
- [ ] Load testing completed
- [ ] Backup script automated
- [ ] QA checklist completed
- [ ] Lighthouse scores >85

---

## 🎯 SUMMARY & SUCCESS METRICS

### Final Score Card
| Dimension | Before | After | Improvement |
|-----------|--------|-------|-------------|
| Security | 40% | 90% | +50% |
| Performance | 60% | 90% | +30% |
| Code Quality | 50% | 85% | +35% |
| Test Coverage | 3% | 65% | +62% |
| Type Safety | 60% | 95% | +35% |
| Documentation | 30% | 80% | +50% |

### Business Impact
- **Cost Reduction:** 65% (AI + DB)
- **Performance:** 67% faster (LCP 4.5s → 1.5s)
- **Bundle Size:** -60% (450KB → 180KB)
- **Security Risk:** Critical issues eliminated
- **Scalability:** Ready for 100k+ users

### Grade Achieved: **A- (85%)**

---

## 📝 EXECUTION NOTES

### Priority Order
1. **Week 1:** Phase 0-1 (Security critical)
2. **Week 2:** Phase 2-3 (Performance & Quality)
3. **Week 3:** Phase 4-5 (Testing & Architecture)
4. **Week 4:** Phase 6-7 (AI & Documentation)
5. **Week 5-6:** Phase 8 (Final polish)

### Daily Checklist Template
```markdown
## Daily Standup Template

### Today's Goals
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

### Completed Yesterday
- [x] Previous task

### Blockers
- None

### Verification Commands
\`\`\`bash
npm run build
npm run test
npm run lint
\`\`\`
```

### Continuous Verification
```bash
# Run before committing
npm run build        # TypeScript check
npm run test:run     # Unit tests
npm run lint         # Code style
git status           # Check changes
```

---

**END OF ROADMAP**

Ready to transform your platform! 🚀
