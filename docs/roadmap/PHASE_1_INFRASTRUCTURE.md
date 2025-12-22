# Phase 1: Critical Security & Infrastructure

**Timeline:** Week 1, Days 3-5 (24 hours)  
**Priority:** 🔴 CRITICAL

---

## Task 1.1: Complete Multi-Tenancy Implementation (12h)

### Step 1: Make organizationId required

**File:** `/types/firestore.ts`

```typescript
// AFTER
export interface BaseEntity {
    id?: string;
    createdAt?: Date | Timestamp;
    updatedAt?: Date | Timestamp;
    organizationId: string; // ✅ Required
}

// Exception for global entities
export interface GlobalEntity {
    id?: string;
    createdAt?: Date | Timestamp;
    updatedAt?: Date | Timestamp;
}
```

### Step 2: Update auth context

**File:** `/context/auth-context.tsx`

```typescript
// Enforce org requirement
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
    return;
}
```

### Step 3: Create org-scoped query helper

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

### Step 4: Update all hooks

**File:** `/hooks/firestore/use-projects.ts`

```typescript
import { useAuth } from '@/context/auth-context';

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

### Step 5: Update Firestore rules

```javascript
function belongsToUserOrg() {
    return resource.data.organizationId == 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.organizationId;
}

match /projects/{projectId} {
    allow read: if isAuthenticated() && belongsToUserOrg();
    allow write: if isAuthenticated() && belongsToUserOrg() && isAdmin();
}
```

### Step 6: Migration script

**Create:** `/scripts/migrate-multi-tenancy.ts`

```typescript
import { adminDb } from '@/lib/firebase-admin';

async function migrateToMultiTenancy() {
    const DEFAULT_ORG_ID = 'default';
    const collections = ['projects', 'customers', 'tickets', 'agent_sessions'];
    
    for (const collectionName of collections) {
        const snapshot = await adminDb
            .collection(collectionName)
            .where('organizationId', '==', null)
            .get();
        
        const batch = adminDb.batch();
        snapshot.forEach(doc => {
            batch.update(doc.ref, { organizationId: DEFAULT_ORG_ID });
        });
        await batch.commit();
        
        console.log(`✅ Migrated ${snapshot.size} ${collectionName}`);
    }
}

migrateToMultiTenancy().catch(console.error);
```

**Run:** `npx ts-node scripts/migrate-multi-tenancy.ts`

---

## Task 1.2: Add Composite Firestore Indexes (2h)

**Update:** `/firestore.indexes.json`

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
        }
    ]
}
```

**Deploy:** `firebase deploy --only firestore:indexes`

---

## Task 1.3: Replace Mock Data with Real Queries (6h)

**File:** `/hooks/use-portal-data.ts`

Replace hardcoded mock data with real Firestore queries using `useProjects` and `useTickets` hooks.

---

## Task 1.4: Standardize Error Responses (4h)

**Create:** `/lib/api-response.ts`

```typescript
import { NextResponse } from 'next/server';

export class ApiResponse {
    static success<T>(data: T, status = 200) {
        return NextResponse.json(
            { data, timestamp: new Date().toISOString() },
            { status }
        );
    }
    
    static error(message: string, status = 500, code?: string) {
        return NextResponse.json(
            { error: message, code, timestamp: new Date().toISOString() },
            { status }
        );
    }
    
    static badRequest(message: string) { return this.error(message, 400, 'BAD_REQUEST'); }
    static unauthorized() { return this.error('Unauthorized', 401, 'UNAUTHORIZED'); }
    static forbidden() { return this.error('Forbidden', 403, 'FORBIDDEN'); }
    static notFound() { return this.error('Not found', 404, 'NOT_FOUND'); }
    static serverError() { return this.error('Internal error', 500, 'INTERNAL_ERROR'); }
}
```

---

## Phase 1 Acceptance Criteria

- [ ] `organizationId` required on all tenant-scoped entities
- [ ] All queries filter by `organizationId`
- [ ] Firestore rules enforce data isolation
- [ ] Indexes deployed
- [ ] Mock data replaced with real queries
- [ ] Standardized API responses
