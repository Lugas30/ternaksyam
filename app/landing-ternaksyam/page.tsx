import React from "react";

// --- Tipe Data Dummy ---
interface LandingPageData {
  logoText: string;
  tagline: string;
  solutionTitle: string;
  successRate: string;
  videoPlaceholder: string;
  buttonText: string;
  safetyStatus: string;
  bpomLogo: string;
  halalLogo: string;
  satisfiedCustomers: string;
  testimonialTitle: string;
  trustedBy: string;
  testimonialTagline: string;
}

const dummyData: LandingPageData = {
  logoText: "TernakSyams",
  tagline:
    "Solusi Masalah Kesehatan Untuk Semua Dari Kami, Untuk Kamu dan Semua Orang",
  solutionTitle: "Peningkatan Kesehatan Alami",
  successRate:
    "72% Pembeli merasakan perubahan dalam tubuh mereka setelah 14 Hari konsumsi rutin",
  videoPlaceholder: "Video Perkenalan Produk", // Deskripsi untuk placeholder video
  buttonText: "Cari solusi bersama kami",
  safetyStatus: "Telah teruji sebagai minuman aman dan halal",
  bpomLogo: "BADAN POM", // Placeholder teks untuk logo BPOM
  halalLogo: "HALAL INDONESIA", // Placeholder teks untuk logo Halal
  satisfiedCustomers: "300.000 + Pelanggan puas",
  testimonialTitle: "Testimonial",
  trustedBy: "Dipercaya lebih dari 10.000 pelanggan",
  testimonialTagline:
    "Jangan percaya kami, lihat perjuangan dan kesuksesan mereka meraih kesehatan yang diimpikan",
};

// --- Komponen Logo ---
const Logo: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center justify-center py-4">
    <div className="badge badge-lg bg-[#558B2F] text-white font-bold px-4 py-3">
      {text}
    </div>
  </div>
);

// --- Komponen Placeholder Logo (menggunakan div untuk simulasi gambar logo) ---
const LogoPlaceholder: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex flex-col items-center justify-center p-2">
    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500 border border-gray-400">
      {text.substring(0, 7)}
    </div>
  </div>
);

// --- Komponen Landing Page Utama ---
const MobileLandingPage: React.FC = () => {
  const {
    logoText,
    tagline,
    successRate,
    videoPlaceholder,
    buttonText,
    safetyStatus,
    bpomLogo,
    halalLogo,
    satisfiedCustomers,
    testimonialTitle,
    trustedBy,
    testimonialTagline,
  } = dummyData;

  return (
    // Container untuk simulasi tampilan Mobile
    <div className="max-w-sm mx-auto bg-white shadow-xl min-h-screen">
      {/* Bagian Atas: Logo & Tagline */}
      <section className="text-center p-4">
        <Logo text={logoText} />
        <h1 className="text-2xl font-bold text-[#1F4E3D] mt-2 leading-snug">
          {tagline}
        </h1>
        <p className="text-sm text-gray-600 mt-3 px-6">{successRate}</p>
      </section>

      {/* Bagian Video Placeholder */}
      <section className="p-4 pt-0">
        <div className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center relative shadow-inner">
          <div className="w-16 h-16 bg-white bg-opacity-70 rounded-full flex items-center justify-center cursor-pointer">
            <svg
              className="w-8 h-8 text-gray-700"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 3l14 9-14 9V3z" />
            </svg>
          </div>
          <span className="absolute bottom-2 text-xs text-gray-700">
            {videoPlaceholder}
          </span>
        </div>
      </section>

      {/* Bagian Tombol Aksi */}
      <section className="px-4 pb-4">
        <button className="btn w-full bg-[#1F4E3D] hover:bg-[#153a2d] text-white border-none normal-case text-base rounded-lg shadow-lg">
          {buttonText}
        </button>
      </section>

      {/* Bagian Keamanan & Pelanggan Puas */}
      <section className="text-center p-4">
        <p className="text-xs text-gray-700 mb-4">{safetyStatus}</p>
        <div className="flex justify-around items-center">
          {/* BPOM & Halal Logos */}
          <div className="flex gap-4 items-center">
            <LogoPlaceholder text={bpomLogo} />
            <LogoPlaceholder text={halalLogo} />
          </div>

          {/* Jumlah Pelanggan */}
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-[#1F4E3D] leading-none">
              {satisfiedCustomers.split(" ")[0]}
            </span>
            <span className="text-sm text-gray-600 leading-tight">
              {satisfiedCustomers.substring(
                satisfiedCustomers.indexOf(" ") + 1
              )}
            </span>
          </div>
        </div>
      </section>

      {/* Bagian Testimonial (Warna Hijau Gelap) */}
      <section className="bg-[#1F4E3D] p-6 text-white min-h-[30vh] mt-4">
        <h2 className="text-3xl md:text-4xl font-extrabold border-b-4 border-white pb-2 inline-block">
          {testimonialTitle}
        </h2>
        <h3 className="text-xl md:text-2xl font-semibold mt-4">{trustedBy}</h3>
        <p className="text-sm mt-2 text-gray-200">{testimonialTagline}</p>

        {/* Placeholder untuk List Testimonial */}
        <div className="mt-6 text-center text-sm italic text-gray-400">
          [Area untuk carousel/list Testimonial]
        </div>
      </section>
    </div>
  );
};

export default MobileLandingPage;
