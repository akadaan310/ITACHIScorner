import { ImageResponse } from "next/og";

export const alt = "Itachi's Corner — Where Truth Meets Dialogue. Independent concept, not endorsed.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(180deg,#060509 0%,#1d1230 55%,#9b2a3f 100%)", color: "#F6EBDC" }}>
        <div style={{ fontSize: 28, letterSpacing: 8, color: "#FA536D" }}>{"// ITACHI'S CORNER"}</div>
        <div style={{ fontSize: 110, fontWeight: 800, lineHeight: 0.95, marginTop: 20 }}>WHERE TRUTH</div>
        <div style={{ fontSize: 110, fontWeight: 800, lineHeight: 0.95, color: "#D7AD65" }}>MEETS DIALOGUE.</div>
        <div style={{ fontSize: 26, letterSpacing: 6, marginTop: 30, color: "#F7C65B" }}>FAITH // KNOWLEDGE // REASON</div>
        <div style={{ fontSize: 20, marginTop: 40, opacity: 0.7 }}>Independent concept — unaffiliated and not yet endorsed.</div>
      </div>
    ),
    size,
  );
}
