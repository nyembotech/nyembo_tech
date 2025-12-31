import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Define the output schema for the LLM
const translationSchema = z.object({
    translations: z.object({
        en: z.string().optional(),
        sw: z.string().optional(),
        de: z.string().optional(),
    })
});

export async function POST(req: Request) {
    try {
        const { text, sourceLang, targetLangs } = await req.json();

        if (!text || !targetLangs || targetLangs.length === 0) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        console.log(` Translating: "${text.substring(0, 50)}..." [${sourceLang} -> ${targetLangs.join(',')}]`);

        // Check for OpenAI Key
        if (!process.env.OPENAI_API_KEY) {
            // Mock Response
            await new Promise(r => setTimeout(r, 1000));
            const mockTranslations: any = {};
            targetLangs.forEach((lang: string) => {
                mockTranslations[lang] = `[MOCK-${lang.toUpperCase()}] ${text}`;
            });
            // Save Mock Job
            await adminDb.collection('translations').add({
                sourceText: text,
                sourceLanguage: sourceLang || 'en',
                targetLanguages: targetLangs,
                translations: mockTranslations,
                status: 'completed',
                createdAt: FieldValue.serverTimestamp(),
                mock: true
            });
            return NextResponse.json({ translations: mockTranslations });
        }

        // Call LLM
        const systemPrompt = `You are an expert Localization Assistant for Nyembotech, a futuristic tech company in Kenya dealing with AI, Smart Spaces, and Cloud.
        
        Translate the source text into the requested target languages: ${targetLangs.join(', ')}.
        
        Guidelines:
        - Tone: Professional, Innovative, yet accessible.
        - Terminology: Keep brand names like "Nyembotech", "AI Architect", "Smart Spaces", "Nyembo Guide" in English (or as properly branded terms).
        - Swahili: Use modern, tech-savvy standard Swahili (Kiswahili Sanifu).
        - German: Use formal "Sie" but modern business German.
        
        Source Language: ${sourceLang || 'en'}
        `;

        const { object } = await generateObject({
            model: openai("gpt-4o-mini"),
            schema: translationSchema,
            system: systemPrompt,
            prompt: text,
        });

        // Save to Firestore
        await adminDb.collection('translations').add({
            sourceText: text,
            sourceLanguage: sourceLang || 'en',
            targetLanguages: targetLangs,
            translations: object.translations,
            status: 'completed',
            createdAt: FieldValue.serverTimestamp()
        });

        return NextResponse.json(object);

    } catch (error: any) {
        console.error("Translation API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
