import React, { useState } from "react";

// dummy data
const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ"; // Ganti dengan ID video yang Anda inginkan

// --- Komponen Modal Video (Didefinisikan di dalam file yang sama) ---
interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoId,
}) => {
  if (!isOpen) return null;

  // URL embed YouTube
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  return (
    // Backdrop gelap (Overlay)
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-opacity-50 p-4"
      onClick={onClose} // Menutup modal saat mengklik di luar area video
    >
      {/* Container Modal, mencegah penutupan saat mengklik di dalamnya */}
      <div
        className="relative w-full max-w-4xl rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup */}
        <button
          className="absolute -top-3 -right-3 text-white bg-accent rounded-full text-3xl font-bold px-2 leading-none hover:text-gray-300 z-110"
          onClick={onClose}
          aria-label="Tutup modal"
        >
          &times;
        </button>

        {/* Video Player (Iframe) */}
        {/* Tailwind untuk rasio aspek 16:9: pt-[56.25%] */}
        <div className="relative pt-[56.25%] bg-black rounded-lg">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={embedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};
// ------------------------------------------------------------------

export default function TestimonialSection() {
  // 1. Tambahkan state untuk mengontrol modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <section className="w-full bg-neutral">
      {/* ATAS: Testimonial */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 pb-48">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[520px] items-center gap-0">
          {/* Kolom kiri */}
          <div className="py-16 md:py-24 pr-0 md:pr-8">
            <h2 className="text-white/90 font-extrabold tracking-tight leading-none text-[48px] md:text-[60px]">
              Testimonial
            </h2>

            <div className="mt-5 h-1.5 w-[110px] bg-white/80 rounded-full" />

            <h3 className="mt-8 text-white font-extrabold leading-tight text-3xl md:text-[34px]">
              Dipercaya lebih dari <br /> 10.000 pelanggan
            </h3>

            <p className="mt-5 text-white/80 max-w-[460px] leading-relaxed">
              Jangan percaya kami, lihat perjuangan dan kesuksesan mereka meraih
              kesehatan yang diimpikan
            </p>

            {/* Tombol play + label */}
            <div className="mt-8 flex items-center gap-4">
              <button
                aria-label="Tonton video testimoni"
                // 2. Tambahkan handler onClick di sini
                onClick={openModal}
                className="relative inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/90 transition-all hover:scale-110 active:scale-95 bg-white/10"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="translate-x-px"
                >
                  <path d="M8 5l12 7-12 7V5z" fill="white" />
                </svg>
              </button>
              <span className="text-white font-medium">
                Tonton video testimoni
              </span>
            </div>
          </div>

          {/* Kolom kanan: kartu testimoni */}
          <div className="relative py-16 md:py-24 pl-0 md:pl-8">
            {/* Kartu */}
            <div className="relative mx-auto bg-white rounded-lg shadow-lg overflow-hidden max-w-[560px]">
              {/* Sudut kanan atas: lingkaran seperempat + ikon kutip */}
              <div className="pointer-events-none absolute right-0 top-0 h-[120px] w-[120px] bg-primary rounded-bl-[120px] flex items-start justify-end pr-3 pt-3">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="opacity-90"
                >
                  <path
                    d="M9 7H7a4 4 0 00-4 4v6h6v-6H7V9h2V7zm12 0h-2a4 4 0 00-4 4v6h6v-6h-2V9h2V7z"
                    fill="#E6FFF6"
                  />
                </svg>
              </div>

              {/* Isi kartu */}
              <div className="px-8 pt-10 pb-10 text-center">
                {/* Navigasi kiri/kanan */}
                <div className="mb-6 flex items-center justify-between">
                  <button
                    aria-label="Sebelumnya"
                    className="text-[#1E8A6E] hover:opacity-80"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M15 18l-6-6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div />
                  <button
                    aria-label="Berikutnya"
                    className="text-[#1E8A6E] hover:opacity-80"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Avatar */}
                <div className="mx-auto mb-4 h-16 w-16 rounded-full overflow-hidden ring-4 ring-white shadow">
                  <img
                    alt="Irma Septiana"
                    className="h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop"
                  />
                </div>

                <h4 className="text-[#145C4C] font-semibold text-[20px]">
                  Irma Septiana
                </h4>
                <p className="text-[#1E8A6E] text-sm">Jakarta, 32 Tahun</p>

                <p className="mt-6 text-slate-600 leading-relaxed">
                  Lutut yang sebelumnya suka sakit saat naik tangga, sekarang
                  berangsur membaik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Render Komponen Modal Video di level yang sama dengan section */}
      <VideoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        videoId={YOUTUBE_VIDEO_ID}
      />
    </section>
  );
}
