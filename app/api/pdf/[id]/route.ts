import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();

  // Verify auth via cookie
  const cookieHeader = request.headers.get("cookie") || "";
  const authClient = createServerClient(cookieHeader);
  const { data: { session } } = await authClient.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch resume
  const { data: resume, error } = await supabase
    .from("resumes")
    .select(`*, personal_info(*), resume_sections(*, section_items(*))`)
    .eq("id", params.id)
    .eq("user_id", session.user.id)
    .single();

  if (error || !resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  try {
    // Generate PDF via Puppeteer
    const puppeteer = await import("puppeteer");
    const browser = await puppeteer.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });

    // Build internal URL for PDF rendering
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const renderUrl = `${baseUrl}/resume/print/${resume.id}?token=${session.access_token}`;

    await page.goto(renderUrl, { waitUntil: "networkidle0", timeout: 30000 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resume.title.replace(/\s+/g, "-")}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    // Fallback: return HTML that the browser can print
    return NextResponse.json(
      { error: "PDF generation failed. Please try printing from the preview page." },
      { status: 500 }
    );
  }
}
