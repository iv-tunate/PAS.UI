import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Akintola Samuel";
export const size = { width: 800, height: 800 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "800px",
          height: "800px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0C0E",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "50px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(28,152,216,0.35) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            left: "50px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(196,93,150,0.3) 0%, transparent 70%)",
          }}
        />

        {/* AS monogram */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "220px",
            fontWeight: "400",
            color: "#FAFAF9",
            letterSpacing: "-0.06em",
            fontFamily: "Georgia, serif",
          }}
        >
          AS
        </div>

        {/* Bottom gradient bar */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "4px",
            background:
              "linear-gradient(90deg, #1C98D8 0%, #6D6FC4 50%, #C45D96 100%)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}

