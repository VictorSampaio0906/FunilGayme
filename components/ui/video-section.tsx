"use client";
import { useEffect } from "react";

export default function VideoSection() {
  useEffect(() => {
    const existingScript = document.getElementById(
      "scr_683e035f58c3f17ae88f3fbb"
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src =
        "https://scripts.converteai.net/9007d22d-9748-4f6c-bc4a-a10286b7c786/players/683e035f58c3f17ae88f3fbb/player.js";
      script.id = "scr_683e035f58c3f17ae88f3fbb";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="rounded-t-2xl sm:rounded-t-3xl overflow-hidden w-full max-w-3xl mx-auto">
      <div
        id="vid_683e035f58c3f17ae88f3fbb"
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 aspect ratio
        }}
      >
        <img
          id="thumb_683e035f58c3f17ae88f3fbb"
          src="https://images.converteai.net/9007d22d-9748-4f6c-bc4a-a10286b7c786/players/683e035f58c3f17ae88f3fbb/thumbnail.jpg"
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
          id="backdrop_683e035f58c3f17ae88f3fbb"
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
