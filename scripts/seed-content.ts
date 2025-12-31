import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

if (!getApps().length) {
    const credential = SERVICE_ACCOUNT ? cert(SERVICE_ACCOUNT) : applicationDefault();
    initializeApp({ credential });
}

const db = getFirestore();
const LOG_TAG = "[SEED-CONTENT]";

const LANGUAGES = ["en", "de", "sw"] as const;

async function seedContent() {
    for (const lang of LANGUAGES) {
        const fileName = `site-content-${lang}.json`;
        const filePath = path.join(process.cwd(), fileName);

        if (!fs.existsSync(filePath)) {
            console.warn(`${LOG_TAG} File not found: ${fileName}, skipping.`);
            continue;
        }

        console.log(`${LOG_TAG} Seeding from ${fileName}...`);
        const rawData = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(rawData);

        // Seed Site Content
        const contentKey = lang === 'en' ? 'site_content' : `site_content_${lang}`;
        const siteContentData = data[contentKey] || data.site_content; // Fallback to 'site_content' if specific key missing

        if (siteContentData) {
            for (const [key, value] of Object.entries(siteContentData) as [string, any][]) {
                // For 'en', we also seed to the base key (e.g. 'home') for backward compatibility/defaults
                if (lang === "en") {
                    await db.collection("site_content").doc(key).set(value as any);
                    console.log(`Saved site_content/${key} (Default EN)`);
                }
                // Seed with language suffix
                const docId = `${key}_${lang}`;
                await db.collection("site_content").doc(docId).set(value as any);
                console.log(`Saved site_content/${docId}`);
            }
        } else {
            console.warn(`${LOG_TAG} Key '${contentKey}' (or 'site_content') not found in ${fileName}`);
        }

        // Seed Case Studies
        if (data.case_studies && Array.isArray(data.case_studies)) {
            for (const study of data.case_studies) {
                if (study.id) {
                    const docId = `${study.id}_${lang}`;
                    await db.collection("case_studies").doc(docId).set(study);
                    console.log(`Saved case_studies/${docId}`);

                    if (lang === 'en') {
                        await db.collection("case_studies").doc(study.id).set(study);
                    }
                }
            }
        }

        // Seed Knowledge Articles
        if (data.knowledge_articles && Array.isArray(data.knowledge_articles)) {
            for (const article of data.knowledge_articles) {
                if (article.id) {
                    const docId = `${article.id}_${lang}`;
                    await db.collection("knowledge_articles").doc(docId).set(article);
                    console.log(`Saved knowledge_articles/${docId}`);

                    if (lang === 'en') {
                        await db.collection("knowledge_articles").doc(article.id).set(article);
                    }
                }
            }
        }
    }
    console.log(`${LOG_TAG} Seeding Complete.`);
}

seedContent().catch(console.error);
