import { NextResponse } from "next/server";

export async function GET() {
    throw new Error("Sentry Test Error from API Route");
    return NextResponse.json({ message: "Should not be reached" });
}
