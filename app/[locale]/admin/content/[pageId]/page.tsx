import { ContentEditor } from "@/components/admin/content/content-editor";

// Ensure this is treated as a server component that passes params to client component if needed, 
// OR just make it client component if we handle params unwrapping there.
// Next.js 15 requires awaiting params.

export default async function AdminContentEditorPage({ params }: { params: Promise<{ pageId: string }> }) {
    const resolvedParams = await params;

    return (
        <div className="h-[calc(100vh-4rem)] overflow-hidden">
            <ContentEditor pageId={resolvedParams.pageId} />
        </div>
    );
}
