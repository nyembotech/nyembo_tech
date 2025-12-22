"use client";

import { useEffect, useState } from "react";

interface OpenAPISpec {
    info: {
        title: string;
        description: string;
        version: string;
    };
    paths: Record<string, unknown>;
}

export default function APIDocsPage() {
    const [spec, setSpec] = useState<OpenAPISpec | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/openapi.json")
            .then(res => res.json())
            .then(data => {
                setSpec(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!spec) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground">Failed to load API documentation</p>
            </div>
        );
    }

    const paths = Object.entries(spec.paths);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto py-12 px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">{spec.info.title}</h1>
                    <p className="text-muted-foreground">{spec.info.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-sm rounded">
                        v{spec.info.version}
                    </span>
                </div>

                {/* Base URL */}
                <div className="mb-8 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Base URL</p>
                    <code className="text-foreground">/api</code>
                </div>

                {/* Endpoints */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-foreground">Endpoints</h2>

                    {paths.map(([path, methods]) => (
                        <div key={path} className="border border-border rounded-lg overflow-hidden">
                            {Object.entries(methods as Record<string, { summary: string; description: string; tags?: string[] }>).map(([method, details]) => (
                                <div key={`${path}-${method}`} className="p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${method === "get" ? "bg-blue-500/20 text-blue-400" :
                                                method === "post" ? "bg-green-500/20 text-green-400" :
                                                    method === "put" ? "bg-yellow-500/20 text-yellow-400" :
                                                        method === "delete" ? "bg-red-500/20 text-red-400" :
                                                            "bg-gray-500/20 text-gray-400"
                                            }`}>
                                            {method}
                                        </span>
                                        <code className="text-foreground font-mono">{path}</code>
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground">{details.summary}</h3>
                                    <p className="text-muted-foreground text-sm">{details.description}</p>
                                    {details.tags && (
                                        <div className="mt-2 flex gap-1">
                                            {details.tags.map(tag => (
                                                <span key={tag} className="px-2 py-0.5 bg-muted text-xs rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Authentication */}
                <div className="mt-8 p-4 border border-border rounded-lg">
                    <h2 className="text-xl font-bold text-foreground mb-2">Authentication</h2>
                    <p className="text-muted-foreground text-sm">
                        Protected endpoints require a Firebase ID token in the Authorization header:
                    </p>
                    <code className="block mt-2 p-2 bg-muted rounded text-sm">
                        Authorization: Bearer &lt;firebase-id-token&gt;
                    </code>
                </div>

                {/* Download Link */}
                <div className="mt-8 text-center">
                    <a
                        href="/api/openapi.json"
                        target="_blank"
                        className="text-primary hover:underline"
                    >
                        Download OpenAPI Specification (JSON)
                    </a>
                </div>
            </div>
        </div>
    );
}
