# Multi-Tenancy Migration Strategy

## Overview
This document outlines the strategy for migrating Nyembotech from a single-tenant architecture to a multi-tenant one. 
Currently, the codebase supports `organizationId` in types and `AuthContext`, and has a drafted security ruleset.

## Phase 1: Data Migration
The goal is to backfill existing data with a default `organizationId`.

### Steps:
1.  **Create Default Organization**
    - Create a document in `organizations/default`.
    - Name: "Nyembotech" (or client name).
    - Owner: Current Super Admin.

2.  **Backfill Scripts**
    - Run a script to update all existing docs in:
        - `customers`
        - `projects`
        - `tasks`
        - `tickets`
        - `users`
    - Set `organizationId = "default"`.

    *Example Script Logic:*
    ```typescript
    const colRef = collection(db, 'projects');
    const snapshot = await getDocs(colRef);
    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
        if (!doc.data().organizationId) {
            batch.update(doc.ref, { organizationId: 'default' });
        }
    });
    await batch.commit();
    ```

## Phase 2: Rules Deployment
1.  **Review Draft**: Audit `firestore.rules.draft` against specific business logic.
2.  **Test in Emulator**: Use the Firebase Emulator to verify that:
    - User in "Org A" cannot see "Org B" data.
    - Super Admin can see all.
3.  **Deploy**: Replace `firestore.rules` with the new content and deploy.

## Phase 3: Application Update
1.  **Require Organization**: Update UI forms (Add Customer, Add Project) to automatically attach `organization.id` from `AuthContext`.
2.  **Enforce Context**: Ensure `AuthContext` blocks rendering if no organization is resolved (except for login/onboarding).
3.  **Invite Flow**: Update invites to include `organizationId` in the token payload or invitation doc.

## Notes
- `SmartSpace` entities are brand new and should be created with `organizationId` from day one.
- `PageContent` (CMS) might need to remain global or be duplicated per org if white-labeling the website itself.
