/**
 * OpenAPI Specification
 * 
 * Returns the OpenAPI 3.0 specification for the Nyembotech API.
 */

import { NextResponse } from "next/server";

const openApiSpec = {
    openapi: "3.0.3",
    info: {
        title: "Nyembotech API",
        description: "AI-powered business platform API",
        version: "1.0.0",
        contact: {
            name: "Nyembotech Support",
            email: "support@nyembotech.com",
        },
    },
    servers: [
        {
            url: "https://nyembotech.com/api",
            description: "Production server",
        },
        {
            url: "http://localhost:3000/api",
            description: "Development server",
        },
    ],
    paths: {
        "/health": {
            get: {
                summary: "Health Check",
                description: "Check the health status of all system components",
                tags: ["System"],
                responses: {
                    "200": {
                        description: "System is healthy",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        overall: { type: "string", enum: ["healthy", "degraded", "unhealthy"] },
                                        firebase: { type: "object" },
                                        openai: { type: "object" },
                                        uptime: { type: "number" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/agent": {
            post: {
                summary: "AI Chat Agent",
                description: "Send a message to the AI chat agent",
                tags: ["AI"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["messages"],
                                properties: {
                                    messages: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                role: { type: "string", enum: ["user", "assistant", "system"] },
                                                content: { type: "string" },
                                            },
                                        },
                                    },
                                    agentType: { type: "string", enum: ["sales", "support"], default: "sales" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Streaming response from AI agent",
                        content: {
                            "text/event-stream": {
                                schema: { type: "string" },
                            },
                        },
                    },
                    "400": { description: "Invalid request" },
                    "429": { description: "Rate limit exceeded" },
                },
            },
        },
        "/insights": {
            get: {
                summary: "AI Insights",
                description: "Get AI-generated insights based on user data",
                tags: ["AI"],
                parameters: [
                    {
                        name: "userId",
                        in: "query",
                        required: true,
                        schema: { type: "string" },
                    },
                    {
                        name: "role",
                        in: "query",
                        schema: { type: "string", enum: ["admin", "customer"] },
                    },
                ],
                responses: {
                    "200": {
                        description: "Array of insights",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            type: { type: "string", enum: ["info", "warning", "opportunity"] },
                                            text: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/translate": {
            post: {
                summary: "Translation",
                description: "Translate text to multiple languages",
                tags: ["AI"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["text", "targetLangs"],
                                properties: {
                                    text: { type: "string" },
                                    sourceLang: { type: "string", default: "en" },
                                    targetLangs: { type: "array", items: { type: "string" } },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Translations",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        translations: {
                                            type: "object",
                                            additionalProperties: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/user/export": {
            post: {
                summary: "Export User Data",
                description: "Export all user data (GDPR compliance)",
                tags: ["User"],
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "User data export" },
                    "401": { description: "Authentication required" },
                },
            },
        },
        "/admin/customers/anonymize": {
            post: {
                summary: "Anonymize Customer",
                description: "Anonymize customer data (GDPR compliance)",
                tags: ["Admin"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["customerId"],
                                properties: {
                                    customerId: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": { description: "Customer anonymized" },
                    "401": { description: "Authentication required" },
                    "403": { description: "Admin access required" },
                },
            },
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "Firebase ID token",
            },
        },
    },
    tags: [
        { name: "System", description: "System health and status" },
        { name: "AI", description: "AI-powered endpoints" },
        { name: "User", description: "User management" },
        { name: "Admin", description: "Admin-only endpoints" },
    ],
};

export async function GET() {
    return NextResponse.json(openApiSpec);
}
