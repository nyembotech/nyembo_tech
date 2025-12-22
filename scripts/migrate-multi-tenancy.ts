/**
 * Multi-Tenancy Migration Script
 * 
 * This script adds organizationId to all existing documents that lack one.
 * Run this once to migrate existing data to multi-tenant architecture.
 * 
 * Usage:
 *   npx ts-node scripts/migrate-multi-tenancy.ts
 * 
 * Prerequisites:
 *   - FIREBASE_SERVICE_ACCOUNT_KEY environment variable set
 *   - Or GOOGLE_APPLICATION_CREDENTIALS pointing to service account JSON
 */

import { initAdmin, adminDb } from '../lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Default organization for migrating existing data
const DEFAULT_ORG_ID = 'default';

// Collections that need organizationId
const TENANT_SCOPED_COLLECTIONS = [
    'projects',
    'customers',
    'tickets',
    'epics',
    'tasks',
    'documents',
    'activity_log',
    'agent_sessions',
    'customer_invites',
    'deletion_requests',
];

interface MigrationResult {
    collection: string;
    migrated: number;
    skipped: number;
    errors: number;
}

async function migrateCollection(collectionName: string): Promise<MigrationResult> {
    const result: MigrationResult = {
        collection: collectionName,
        migrated: 0,
        skipped: 0,
        errors: 0,
    };

    try {
        // Query documents without organizationId
        const snapshot = await adminDb
            .collection(collectionName)
            .where('organizationId', '==', null)
            .limit(500) // Process in batches
            .get();

        if (snapshot.empty) {
            // Also try to find docs where organizationId doesn't exist
            const noFieldSnapshot = await adminDb
                .collection(collectionName)
                .get();

            for (const doc of noFieldSnapshot.docs) {
                const data = doc.data();
                if (!data.organizationId) {
                    try {
                        await doc.ref.update({
                            organizationId: DEFAULT_ORG_ID,
                            updatedAt: FieldValue.serverTimestamp(),
                        });
                        result.migrated++;
                    } catch (err) {
                        console.error(`Error updating ${collectionName}/${doc.id}:`, err);
                        result.errors++;
                    }
                } else {
                    result.skipped++;
                }
            }
        } else {
            // Use batch writes for efficiency
            const batch = adminDb.batch();

            for (const doc of snapshot.docs) {
                batch.update(doc.ref, {
                    organizationId: DEFAULT_ORG_ID,
                    updatedAt: FieldValue.serverTimestamp(),
                });
                result.migrated++;
            }

            await batch.commit();
        }
    } catch (error) {
        console.error(`Error processing ${collectionName}:`, error);
        result.errors++;
    }

    return result;
}

async function ensureDefaultOrganization(): Promise<void> {
    const orgRef = adminDb.collection('organizations').doc(DEFAULT_ORG_ID);
    const orgDoc = await orgRef.get();

    if (!orgDoc.exists) {
        console.log('Creating default organization...');
        await orgRef.set({
            id: DEFAULT_ORG_ID,
            name: 'Nyembotech',
            slug: 'nyembotech',
            ownerId: 'system',
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });
        console.log('Default organization created.');
    } else {
        console.log('Default organization already exists.');
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log('Multi-Tenancy Migration Script');
    console.log('='.repeat(60));
    console.log(`Default Organization ID: ${DEFAULT_ORG_ID}`);
    console.log(`Collections to migrate: ${TENANT_SCOPED_COLLECTIONS.join(', ')}`);
    console.log('');

    // Initialize Firebase Admin
    initAdmin();

    // Ensure default organization exists
    await ensureDefaultOrganization();

    console.log('');
    console.log('Starting migration...');
    console.log('-'.repeat(60));

    const results: MigrationResult[] = [];

    for (const collection of TENANT_SCOPED_COLLECTIONS) {
        console.log(`Processing ${collection}...`);
        const result = await migrateCollection(collection);
        results.push(result);
        console.log(`  ✓ Migrated: ${result.migrated}, Skipped: ${result.skipped}, Errors: ${result.errors}`);
    }

    console.log('');
    console.log('='.repeat(60));
    console.log('Migration Summary');
    console.log('='.repeat(60));

    let totalMigrated = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    for (const result of results) {
        console.log(`${result.collection}: ${result.migrated} migrated, ${result.skipped} skipped, ${result.errors} errors`);
        totalMigrated += result.migrated;
        totalSkipped += result.skipped;
        totalErrors += result.errors;
    }

    console.log('-'.repeat(60));
    console.log(`Total: ${totalMigrated} migrated, ${totalSkipped} skipped, ${totalErrors} errors`);
    console.log('');

    if (totalErrors > 0) {
        console.log('⚠️  Migration completed with errors. Please review the logs.');
        process.exit(1);
    } else {
        console.log('✅ Migration completed successfully!');
    }
}

main().catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
});
