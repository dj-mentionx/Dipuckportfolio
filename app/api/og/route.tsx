import { ImageResponse } from "next/og";
import { visibilityBlocks } from "@/lib/format";

export const runtime = "edge";

function clamp(value: string | null, fallback: string, max = 48): string {
  const next = (value || fallback).trim();
  return next.slice(0, max);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = clamp(searchParams.get("name"), "Untitled file");
  const score = Math.max(0, Math.min(99, Number(searchParams.get("score") || 0) || 0));
  const mentioned = searchParams.get("mentioned") === "1";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#EDE8DD",
          color: "#14120F",
          padding: "64px 72px",
          fontFamily: "Georgia, Times New Roman, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 0.4 }}>
          <span>FILE OPENED</span>
          <span style={{ color: "#B23A2F" }}>{mentioned ? "MENTIONED" : "NOT NAMED"}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, lineHeight: 1.05, maxWidth: 900 }}>{name}</div>
          <div
            style={{
              marginTop: 28,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 36,
              color: "#B23A2F",
            }}
          >
            {visibilityBlocks(score)}  {score}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 20,
            color: "#8C8578",
          }}
        >
          <span>AI VISIBILITY CARD</span>
          <span>scanned via dipuckjones.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
