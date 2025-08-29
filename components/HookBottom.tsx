import React from "react";
import VideoPlayer from "./VideoPlayer";

export default function HookTop() {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1731770207534-4411fd273c9e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}
    >
      {/* <div className="hero-overlay"></div> */}
      <div className="hero-content text-center">
        <div className="max-w-max">
          <h2 className="mb-5 text-4xl font-bold">
            Solusi Masalah Kesehatan Untuk Semua Dari Kami, Untuk Kamu dan Semua
            Orang
          </h2>
          <p className="mb-5">
            72% Pembeli merasakan perubahan dalam tubuh mereka setelah 14 Hari
            konsumsi rutin
          </p>
          <VideoPlayer />
          <button className="btn btn-primary">Get Started</button>
          <p className="mb-5">Telah teruji sebagai minuman aman dan halal</p>
        </div>
      </div>
    </div>
  );
}
