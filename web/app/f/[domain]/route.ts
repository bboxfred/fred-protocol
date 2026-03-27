import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params;

  if (!domain || !/^[a-z0-9][a-z0-9.-]{0,61}[a-z0-9]\.[a-z]{2,}$/i.test(domain)) {
    return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
  }

  // Try Vercel Blob if token is available
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { head } = await import("@vercel/blob");
      const blobInfo = await head(`fred/${domain}.json`);
      const res = await fetch(blobInfo.url);
      const content = await res.text();

      return new NextResponse(content, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
        },
      });
    } catch {
      // Not found in blob store
    }
  }

  // Fallback — redirect to the domain's own fred.json
  return NextResponse.redirect(
    `https://${domain}/.well-known/fred.json`,
    { status: 302 }
  );
}
