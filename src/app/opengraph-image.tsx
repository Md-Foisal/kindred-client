import { ImageResponse } from "next/og";

export const alt = "Kindred - find your people, do some good";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// the card people see when the site link is shared on facebook, linkedin and others
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#0f0d26",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(214,58,249,0.45), transparent 45%), radial-gradient(circle at 100% 100%, rgba(255,181,71,0.35), transparent 40%), radial-gradient(circle at 0% 100%, rgba(91,61,245,0.4), transparent 45%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="76" height="76" viewBox="0 0 32 32">
            <defs>
              <linearGradient id="k" x1="2" y1="6" x2="22" y2="26" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#5b3df5" />
                <stop offset="0.55" stopColor="#d63af9" />
                <stop offset="1" stopColor="#ffb547" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="16" r="9" fill="url(#k)" />
            <circle cx="20.5" cy="16" r="8.25" stroke="white" strokeWidth="2.5" fill="none" />
            <circle cx="16.25" cy="16" r="1.9" fill="white" />
          </svg>
          <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: -2 }}>Kindred</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1, letterSpacing: -4 }}>Find your people.</div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -4,
              backgroundImage: "linear-gradient(100deg, #8b74ff, #e36bff 55%, #ffb547)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Do some good.
          </div>
          <div style={{ marginTop: 28, fontSize: 32, color: "rgba(255,255,255,0.72)", maxWidth: 900 }}>
            Create, join and track cleanups, plantations, food drives and blood camps near you.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "rgba(255,255,255,0.6)" }}>
          <span>Community events platform</span>
          <span>kindred-events.vercel.app</span>
        </div>
      </div>
    ),
    size,
  );
}
