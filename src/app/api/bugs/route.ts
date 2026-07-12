import { mkdir, appendFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

type BugBody = {
  message?: string;
  locale?: string;
  path?: string;
  userAgent?: string;
};

const MAX_LEN = 4000;

export async function POST(request: Request) {
  let body: BugBody;
  try {
    body = (await request.json()) as BugBody;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (message.length < 8) {
    return Response.json({ ok: false, error: "too_short" }, { status: 400 });
  }
  if (message.length > MAX_LEN) {
    return Response.json({ ok: false, error: "too_long" }, { status: 400 });
  }

  const report = {
    id: randomUUID(),
    at: new Date().toISOString(),
    message,
    locale: body.locale ?? "pt",
    path: body.path ?? "",
    userAgent: (body.userAgent ?? "").slice(0, 300),
  };

  // Always land in server logs (works on Vercel dashboard too)
  console.log("[bug-report]", JSON.stringify(report));

  const dir = path.join(process.cwd(), "data");
  const file = path.join(dir, "bug-reports.jsonl");
  try {
    await mkdir(dir, { recursive: true });
    await appendFile(file, `${JSON.stringify(report)}\n`, "utf8");
  } catch (err) {
    // Read-only FS (e.g. some hosts) — log already has the report
    console.warn("[bug-report] file write skipped:", err);
  }

  return Response.json({ ok: true, id: report.id });
}
