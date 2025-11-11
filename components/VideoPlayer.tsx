import React, { useState, useEffect } from "react";
import axios from "axios";

// Variabel lingkungan (sesuaikan jika perlu, tapi berdasarkan prompt, ini adalah strukturnya)
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const VIDEO_PLAYER_API = `${API_URL}/video-players`;

// Tipe data untuk video player
interface VideoPlayer {
  id: number;
  url: string;
  created_at: string;
  updated_at: string;
}

export default function VideoPlayer() {
  // 1. State untuk menyimpan data URL video dari API
  const [videoData, setVideoData] = useState<VideoPlayer | null>(null);
  // 2. State untuk menangani status loading
  const [loading, setLoading] = useState<boolean>(true);
  // 3. State untuk menangani error
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data dari API
  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Mengambil data dari endpoint
        const response = await axios.get(VIDEO_PLAYER_API);

        // Asumsi API mengembalikan objek tunggal (sesuai contoh data)
        setVideoData(response.data);
      } catch (err) {
        console.error("Gagal mengambil data video:", err);
        setError("Gagal memuat video. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, []); // Array kosong memastikan useEffect hanya berjalan sekali setelah render awal

  // --- Rendering Conditional ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-lg font-medium text-gray-600">Memuat video...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48 bg-red-100 p-4 rounded-md border border-red-400">
        <p className="text-lg font-semibold text-red-700">⚠️ {error}</p>
      </div>
    );
  }

  if (!videoData || !videoData.url) {
    return (
      <div className="flex justify-center items-center h-48 bg-yellow-100 p-4 rounded-md border border-yellow-400">
        <p className="text-lg font-medium text-yellow-800">
          Video tidak ditemukan.
        </p>
      </div>
    );
  }

  // --- Render Komponen Utama ---
  return (
    <div className="shadow-xl overflow-hidden">
      <iframe
        // Gunakan URL yang didapat dari state (API)
        src={videoData.url}
        // Menggunakan kelas Tailwind CSS untuk lebar penuh dan rasio aspek video standar (16:9)
        className="w-full aspect-video border-none"
        // Atribut iframe standar untuk kinerja dan fungsionalitas
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        title="Embedded Video Player"
      />
    </div>
  );
}
