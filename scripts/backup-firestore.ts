/**
 * Firestore Backup Script
 * 
 * Creates a backup of all Firestore collections.
 * Run with: npx tsx scripts/backup-firestore.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// This uses the Firebase Admin SDK
async function backupFirestore() {
    // Dynamic import to avoid loading admin SDK at build time
    const { adminDb } = await import('../lib/firebase-admin');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups', timestamp);

    // Create backup directory
    fs.mkdirSync(backupDir, { recursive: true });

    // Collections to backup
    const collections = [
        'users',
        'organizations',
        'customers',
        'projects',
        'tickets',
        'invoices',
        'activity_log',
        'blog_posts',
        'content',
        'translations',
        'sessions',
    ];

    console.log(`Starting backup to ${backupDir}...`);

    for (const collectionName of collections) {
        try {
            console.log(`Backing up ${collectionName}...`);
            const snapshot = await adminDb.collection(collectionName).get();

            const documents: Record<string, unknown>[] = [];
            snapshot.forEach(doc => {
                documents.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            const filePath = path.join(backupDir, `${collectionName}.json`);
            fs.writeFileSync(filePath, JSON.stringify(documents, null, 2));

            console.log(`  ✓ ${collectionName}: ${documents.length} documents`);
        } catch (error) {
            console.error(`  ✗ Failed to backup ${collectionName}:`, error);
        }
    }

    // Create metadata file
    const metadata = {
        timestamp,
        collections,
        createdAt: new Date().toISOString(),
    };
    fs.writeFileSync(
        path.join(backupDir, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
    );

    console.log(`\nBackup completed: ${backupDir}`);
    console.log('To restore, use: npx tsx scripts/restore-firestore.ts <backup-dir>');
}

// Run if executed directly
backupFirestore().catch(console.error);
