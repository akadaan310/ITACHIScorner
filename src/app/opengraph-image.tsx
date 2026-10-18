import { ImageResponse } from "next/og";

export const alt = "Itachi's Corner — da'wah, learning and thoughtful dialogue. Independent concept, not endorsed.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#0c0b10", color: "#F6EBDC", borderLeft: "12px solid #FA536D" }}>
      <div style={{ fontSize: 28, letterSpacing: 4, color: "#FA7C8F" }}>ITACHI&rsquo;S CORNER</div>
      <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.1, marginTop: 30 }}>A little curiosity.</div>
      <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.1, color: "#E6D6CD" }}>A deeper conversation.</div>
      <div style={{ fontSize: 22, marginTop: 48, color: "#B9B0B4" }}>Independent concept — unaffiliated and not yet endorsed.</div>
    </div>, size,
  );
}
