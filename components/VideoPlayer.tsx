import React from "react";
// import { YouTubeEmbed } from "@next/third-parties/google";

export default function VideoPlayer() {
  return (
    <iframe
      src="https://www.youtube.com/embed/t-Kf3b8zpfg?si=N3lOclDe-xIwFYpc&amp;controls=0"
      className="w-full aspect-video"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; web-share"
    />
    // <div className="h-screen aspect-video">
    //   <YouTubeEmbed
    //     videoid="t-Kf3b8zpfg"
    //     params="controls=0"
    //     style="width: 1200px; height: 200px;"
    //   />
    // </div>
  );
}
