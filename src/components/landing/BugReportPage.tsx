"use client";

import { useState } from "react";
import { Bug, Check } from "lucide-react";
import { InfoShell } from "@/components/landing/InfoShell";
import { Button } from "@/components/ui/Button";
import { getBugPage } from "@/lib/i18n/sitePages";
import type { Locale } from "@/types/game";

export function BugReportPage({ locale }: { locale: Locale }) {
  const c = getBugPage(locale);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle",
  );

  const submit = async () => {
    const message = text.trim();
    if (message.length < 8) {
      setStatus("err");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          locale,
          path: typeof window !== "undefined" ? window.location.href : "",
          userAgent:
            typeof navigator !== "undefined" ? navigator.userAgent : "",
        }),
      });
      if (!res.ok) throw new Error("fail");
      setText("");
      setStatus("ok");
    } catch {
      setStatus("err");
    }
  };

  return (
    <InfoShell locale={locale} title={c.title}>
      <p className="font-sans text-base leading-relaxed text-white/65">
        {c.body}
      </p>

      <div className="rounded-2xl border border-arena-buzzer/35 bg-gradient-to-b from-[#1a0c0c] to-arena-panel px-5 py-5 shadow-[0_0_28px_rgba(255,59,48,0.12)]">
        <div className="flex items-center gap-2">
          <Bug className="h-5 w-5 text-arena-buzzer" />
          <h2 className="font-display text-2xl uppercase tracking-wide text-white">
            {c.title}
          </h2>
        </div>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (status !== "idle" && status !== "sending") setStatus("idle");
          }}
          placeholder={c.placeholder}
          rows={6}
          className="mt-4 w-full resize-y rounded-xl border border-white/10 bg-black/30 px-3 py-2 font-sans text-sm text-white placeholder:text-white/30 focus:border-arena-accent focus:outline-none"
        />
        <Button
          className="mt-3 w-full justify-center sm:w-auto"
          disabled={status === "sending"}
          onClick={() => void submit()}
        >
          {status === "ok" ? (
            <Check className="h-4 w-4" />
          ) : (
            <Bug className="h-4 w-4" />
          )}
          {status === "sending"
            ? c.sending
            : status === "ok"
              ? c.sent
              : c.cta}
        </Button>
        {status === "err" && (
          <p className="mt-2 font-sans text-sm text-arena-buzzer">{c.error}</p>
        )}
        {status === "ok" && (
          <p className="mt-2 font-sans text-sm text-emerald-400">{c.thanks}</p>
        )}
      </div>
    </InfoShell>
  );
}
