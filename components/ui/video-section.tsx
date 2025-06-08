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
    <div className="w-full max-w-3xl mx-auto rounded-t-2xl sm:rounded-t-3xl overflow-hidden shadow-xl">
      <div
        id="vid_6842e91f2449f18e10ad201b"
        style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}
      >
        <img
          id="thumb_6842e91f2449f18e10ad201b"
          src="https://images.converteai.net/9007d22d-9748-4f6c-bc4a-a10286b7c786/players/6842e91f2449f18e10ad201b/thumbnail.jpg"
          alt="thumbnail"
          className="absolute top-0 left-0 w-full h-full object-cover rounded-t-2xl"
        />
        <div
          id="backdrop_6842e91f2449f18e10ad201b"
          className="absolute top-0 left-0 w-full h-full backdrop-blur-sm rounded-t-2xl"
        />
      </div>
    </div>
  );
}
