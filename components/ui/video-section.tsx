"use client";
import { useEffect } from "react";

export default function VideoSection() {
  useEffect(() => {
    const existingScript = document.getElementById(
      "scr_6842e91f2449f18e10ad201b"
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src =
        "https://scripts.converteai.net/9007d22d-9748-4f6c-bc4a-a10286b7c786/players/6842e91f2449f18e10ad201b/player.js";
      script.id = "scr_6842e91f2449f18e10ad201b";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="rounded-t-2xl sm:rounded-t-3xl overflow-hidden w-full max-w-3xl mx-auto">
      <div
        id="vid_6842e91f2449f18e10ad201b"
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 aspect ratio
        }}
      >
        <img
          id="thumb_6842e91f2449f18e10ad201b"
          src="https://images.converteai.net/9007d22d-9748-4f6c-bc4a-a10286b7c786/players/6842e91f2449f18e10ad201b/thumbnail.jpg"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
          }}
          alt="thumbnail"
        />
        <div
          id="backdrop_6842e91f2449f18e10ad201b"
          style={{
            position: "absolute",
            top: 0,
            height: "100%",
            width: "100%",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
          }}
        />
      </div>
    </div>
  );
}
