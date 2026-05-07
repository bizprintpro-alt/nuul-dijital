import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #7B6FFF, #00E5B8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#0A0814",
          fontSize: 22,
          fontWeight: 800,
          borderRadius: 7,
          fontFamily: "sans-serif",
        }}
      >
        N
      </div>
    ),
    size
  );
}
