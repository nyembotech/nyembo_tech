import { z } from "zod";

/**
 * Validation schema for AI agent requests.
 * Includes limits to prevent token bombing and abuse.
 */
export const AgentRequestSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().min(1).max(8000), // Prevent token bombing
    })).min(1).max(100), // Limit conversation history
    agentType: z.enum(['sales', 'support']),
    userId: z.string().optional().nullable(),
    projectId: z.string().optional().nullable(),
    language: z.enum(['en', 'sw', 'de']).default('en'),
    sessionId: z.string().uuid().optional()
});

export type AgentRequest = z.infer<typeof AgentRequestSchema>;

/**
 * User data export request validation.
 */
export const UserExportSchema = z.object({
    uid: z.string().min(1, "UID is required")
});

export type UserExportRequest = z.infer<typeof UserExportSchema>;

/**
 * Customer data anonymization request validation.
 */
export const AnonymizeRequestSchema = z.object({
    customerId: z.string().min(1, "Customer ID is required"),
    uid: z.string().min(1, "User ID is required"),
    requestId: z.string().optional()
});

export type AnonymizeRequest = z.infer<typeof AnonymizeRequestSchema>;

/**
 * Translation request validation.
 */
export const TranslateRequestSchema = z.object({
    text: z.string().min(1).max(5000), // Limit translation length
    from: z.enum(['en', 'sw', 'de']),
    to: z.enum(['en', 'sw', 'de']),
});

export type TranslateRequest = z.infer<typeof TranslateRequestSchema>;
