import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.json({ connected: false, reason: "Supabase environment variables are missing" }, { status: 503 });
  }

  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/health`, {
      headers: { apikey: key },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json({ connected: false, reason: "Supabase did not accept the connection" }, { status: 503 });
    }

    return NextResponse.json({ connected: true, service: "Supabase Auth" });
  } catch {
    return NextResponse.json({ connected: false, reason: "Supabase could not be reached" }, { status: 503 });
  }
}
