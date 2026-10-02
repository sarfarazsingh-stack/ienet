import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "The Founder's Shadow: Depth to Defect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#030708",
          color: "#E7F2EA",
          padding: "64px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", color: "#00FF88", fontSize: 22, letterSpacing: 4 }}>
          <span>RESTRICTED // QUESTION 05</span>
          <span>IE TOWER, MADRID</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 28, letterSpacing: 6, color: "#94A3B8" }}>{"THE FOUNDER'S SHADOW"}</div>
          <div style={{ fontSize: 72, lineHeight: 0.95, maxWidth: 920 }}>Depth to Defect</div>
          <div style={{ fontSize: 28, color: "#FFB000" }}>Scaling an obsession, not a deficit.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#94A3B8" }}>
          <span>FOR PROFESSOR JOE HASLAM</span>
          <span>SARFARAZ SINGH WAHAD</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
