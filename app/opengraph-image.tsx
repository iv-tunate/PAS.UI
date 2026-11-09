import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Akintola Samuel — Pastor · Teacher · Author";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#0B0C0E",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Background gradient glows */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(28,152,216,0.35) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(196,93,150,0.3) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "150px",
            left: "400px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(109,111,196,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Bottom gradient bar */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "3px",
            background:
              "linear-gradient(90deg, #1C98D8 0%, #6D6FC4 50%, #C45D96 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 80px 70px 80px",
          }}
        >
          {/* AS badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "52px",
              height: "52px",
              borderRadius: "12px",
              background: "#15171A",
              border: "1px solid rgba(255,255,255,0.12)",
              marginBottom: "28px",
              fontSize: "20px",
              fontWeight: "500",
              color: "#FAFAF9",
              letterSpacing: "-0.03em",
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            AS
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: "88px",
              fontWeight: "400",
              color: "#FAFAF9",
              lineHeight: "1",
              letterSpacing: "-0.03em",
              marginBottom: "20px",
              fontFamily: "Georgia, serif",
            }}
          >
            Akintola Samuel
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "26px",
              color: "rgba(250,250,249,0.45)",
              letterSpacing: "0.08em",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontWeight: "400",
              textTransform: "uppercase",
            }}
          >
            Pastor · Teacher · Author
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

