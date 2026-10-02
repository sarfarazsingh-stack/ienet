import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#030708",
          color: "#00FF88",
          fontSize: 16,
          fontFamily: "monospace",
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
