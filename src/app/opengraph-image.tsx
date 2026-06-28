import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d9488",
          backgroundImage: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.04em",
              marginBottom: 24,
            }}
          >
            Jason Dinamarca
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 500,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              opacity: 0.9,
            }}
          >
            Dev + AI Lab
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            fontSize: 28,
              fontWeight: 400,
              color: "#ffffff",
              opacity: 0.8,
              letterSpacing: "0.05em",
            }}
          >
          jdinamarca.dev
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}