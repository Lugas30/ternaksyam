"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import axios from "axios";

// --- Definisikan Tipe Data ---

// Tipe data untuk benefit (tetap dari kode asli)
interface benefit {
  id: number;
  type: string;
  thumbnail: string;
  benefit: string;
  status: string;
}

// Tipe data untuk FAQ (BARU)
interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category_id: number;
  target: "user" | "affiliate" | "reseller" | "all";
  status: string;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
  };
}

// Konstanta URL dari .env
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL;

const Afiliator = () => {
  // 1. State untuk menyimpan data benefit (Tetap)
  const [benefits, setBenefits] = useState<benefit[]>([]);
  // State untuk menangani status loading (Tetap)
  const [loading, setLoading] = useState(true);
  // State untuk menangani error (Tetap)
  const [error, setError] = useState<string | null>(null);

  // State baru untuk data FAQ (BARU)
  const [faqData, setFaqData] = useState<FaqItem[]>([]);
  const [loadingFaq, setLoadingFaq] = useState(true);
  const [errorFaq, setErrorFaq] = useState<string | null>(null);

  // 2. Fungsi untuk mengambil data benefit (Tetap)
  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/benefit/affiliates`);
        // Asumsi data benefit berada dalam properti 'data'
        setBenefits(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Gagal mengambil data benefit:", err);
        setError("Gagal memuat data benefit. Silakan coba lagi.");
        setBenefits([]); // Kosongkan data jika gagal
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  // 2b. Fungsi untuk mengambil data FAQ (BARU)
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoadingFaq(true);
        const response = await axios.get(`${API_URL}/faqs`);

        // **Filter data:** Hanya yang memiliki "target": "affiliate"
        const filteredData = response.data.filter(
          (item: FaqItem) => item.target === "affiliate"
        );

        setFaqData(filteredData);
        setErrorFaq(null);
      } catch (err) {
        console.error("Gagal mengambil data FAQ:", err);
        setErrorFaq("Gagal memuat data FAQ Affiliate. Silakan coba lagi.");
        setFaqData([]);
      } finally {
        setLoadingFaq(false);
      }
    };

    fetchFaqs();
  }, []);

  // Komponen Card Benefit yang lebih ringkas (Tetap)
  const BenefitCard = ({ benefitData }: { benefitData: benefit }) => (
    <div className="card w-auto bg-base-100 shadow-sm">
      <div className="card-body">
        <img
          // Gunakan URL thumbnail dari data API
          src={benefitData.thumbnail}
          alt={benefitData.benefit} // Gunakan benefit sebagai alt text
          className="mb-3 w-1/4 h-auto mx-auto object-contain"
        ></img>
        <span className="text-sm text-center">
          {/* Tampilkan deskripsi benefit */}
          {benefitData.benefit}
        </span>
      </div>
    </div>
  );

  // Komponen Accordion FAQ (BARU)
  const AffiliateFaqAccordion = ({ faqItem }: { faqItem: FaqItem }) => (
    <div className="collapse collapse-plus bg-gray-200 rounded-xl shadow-sm">
      <input type="checkbox" className="peer" />
      <div className="collapse-title text-base md:text-lg font-medium">
        {faqItem.question}
      </div>
      {/* Gunakan dangerouslySetInnerHTML untuk menampilkan answer yang mungkin mengandung HTML/format teks */}
      <div className="collapse-content text-sm md:text-base text-base-content/80">
        <p dangerouslySetInnerHTML={{ __html: faqItem.answer }} />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-3 md:px-5 lg:px-10">
      <section className="relative mb-20">
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          <div className="hero min-h-screen bg-neutral relative overflow-hidden">
            <div className="hero-content flex-col lg:flex-row-reverse z-10 max-w-6xl mx-auto">
              {/* Gambar produk */}
              <img
                src={"/images/women1.png"}
                alt="Produk Etawa"
                width={500}
                height={500}
              />

              {/* Teks */}
              <div className="text-white lg:mr-10">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Promosikan dan Panen Komisi dengan Affiliate Ternak Syams
                  Sekarang
                </h1>
                <p className="py-6 text-green-100 text-lg">
                  Daftar sekali, cuan berkali-kali!
                </p>
                <Link href="/daftar-afiliator">
                  <button className="btn btn-primary hover:bg-secondary border-none px-8 py-6 my-8 font-bold text-base rounded-full text-white">
                    Daftar Afiliator
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="my-20">
        <h3 className="text-2xl md:text-3xl text-center font-bold leading-tight mb-10">
          Mudah dan Banyak keuntungannya, lho !
        </h3>
        {/* Benefit Affiliate */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 3. Menampilkan status loading, error, atau data benefit */}
          {loading ? (
            // Tampilkan loading state
            <div className="col-span-full text-center py-10">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p>Memuat benefit...</p>
            </div>
          ) : error ? (
            // Tampilkan error state
            <div className="col-span-full text-center py-10 text-error">
              <p>{error}</p>
            </div>
          ) : benefits.length > 0 ? (
            // Render card benefit menggunakan data dari API
            benefits.map((benefitItem) => (
              <BenefitCard key={benefitItem.id} benefitData={benefitItem} />
            ))
          ) : (
            // Tampilkan pesan jika tidak ada data
            <div className="col-span-full text-center py-10 text-gray-500">
              <p>Tidak ada data benefit yang tersedia saat ini.</p>
            </div>
          )}
        </div>
      </section>
      <section className="my-20">
        <h3 className="text-2xl md:text-3xl text-center font-bold leading-tight mb-10">
          Bagaimana cara promosinya?
        </h3>

        <div className="grid grid-cols-3 gap-8">
          <img
            src={"/images/afiliate-capture.png"}
            className="w-full col-span-2"
          ></img>
          <div className="flex flex-col justify-center">
            <p className="text-lg font-semibold mb-5">
              Cukup share link affiliate, buat konten keranjang kuning, dan live
              streaming kapanpun dimanapun
            </p>
            <Link
              href="/arsip"
              className=" font-bold text-2xl text-primary hover:border-b-2 hover:border-primary w-fit"
            >
              Cek Video Tutorial
            </Link>
          </div>
        </div>
      </section>
      <section className="my-20 py-20 bg-stone-200 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div className="container mx-auto px-3 md:px-5 lg:px-10 grid grid-cols-3 gap-4">
          <div className="card w-auto min-h-72 md:min-h-80 bg-base-100 shadow-sm relative overflow-hidden">
            {/* Seperempat lingkaran hijau di pojok kanan atas */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary rounded-bl-full flex items-center justify-center">
              <img
                src={"/images/kutip.svg"}
                className="mb-3 ml-3 object-contain"
              />
            </div>

            <div className="card-body relative flex flex-col justify-between">
              {/* Deskripsi ditengah */}
              <p className="text-sm grow flex items-center justify-center text-center mt-16">
                Berkat ngonten affiliates aku berhasil beli iPhone 13 Pro Max
                buat menunjang bikin konten dan juga bisa renovasi kamar serta
                taman rumah.
              </p>

              {/* Bagian profil tetap di bawah */}
              <div className="flex items-center">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                  </div>
                </div>
                <div className="ml-3">
                  <p>Yelling Cat</p>
                  <span>@yellingwoman</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card w-auto min-h-72 md:min-h-80 bg-base-100 shadow-sm relative overflow-hidden">
            {/* Seperempat lingkaran hijau di pojok kanan atas */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary rounded-bl-full flex items-center justify-center">
              <img
                src={"/images/kutip.svg"}
                className="mb-3 ml-3 object-contain"
              />
            </div>

            <div className="card-body relative flex flex-col justify-between">
              {/* Deskripsi ditengah */}
              <p className="text-sm grow flex items-center justify-center text-center mt-16">
                Berkat ngonten affiliates aku berhasil beli iPhone 13 Pro Max
                buat menunjang bikin konten dan juga bisa renovasi kamar serta
                taman rumah.
              </p>

              {/* Bagian profil tetap di bawah */}
              <div className="flex items-center">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                  </div>
                </div>
                <div className="ml-3">
                  <p>Yelling Cat</p>
                  <span>@yellingwoman</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card w-auto min-h-72 md:min-h-80 bg-base-100 shadow-sm relative overflow-hidden">
            {/* Seperempat lingkaran hijau di pojok kanan atas */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary rounded-bl-full flex items-center justify-center">
              <img
                src={"/images/kutip.svg"}
                className="mb-3 ml-3 object-contain"
              />
            </div>

            <div className="card-body relative flex flex-col justify-between">
              {/* Deskripsi ditengah */}
              <p className="text-sm grow flex items-center justify-center text-center mt-16">
                Berkat ngonten affiliates aku berhasil beli iPhone 13 Pro Max
                buat menunjang bikin konten dan juga bisa renovasi kamar serta
                taman rumah.
              </p>

              {/* Bagian profil tetap di bawah */}
              <div className="flex items-center">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                  </div>
                </div>
                <div className="ml-3">
                  <p>Yelling Cat</p>
                  <span>@yellingwoman</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="my-20">
        <div className="mb-10">
          <h3 className="text-center text-3xl font-bold mb-4">
            Semua bisa jadi Affiliate Professional
          </h3>
          <p className="text-center">
            Pelatihan rutin untuk para mitra agar bisa menjadi Affiliate
            Professional
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="/images/training1.png" className="mx-auto" />
          <img src="/images/training2.png" className="mx-auto" />
        </div>
        <img src="/images/gtapro.png" className="mx-auto" />
      </section>

      <section className="my-20">
        <div className="hero min-h-28 bg-neutral relative overflow-hidden rounded-2xl">
          <div className="hero-content flex-col lg:flex-row z-10 max-w-6xl mx-auto">
            {/* Gambar produk */}
            <img
              src="/images/women2.png"
              alt="daftar affilator"
              width={350}
              className="my-5 p-3"
            />

            {/* Teks */}
            <div className="text-white lg:mr-10">
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                Siap mulai jadi reseller dan punya penghasilan sendiri?
              </h1>
              <p className="py-6 text-green-100 text-lg">
                Daftar sekali, cuan berkali-kali!
              </p>
              <Link href="/daftar-afiliator">
                <button className="btn btn-primary hover:bg-secondary border-none px-8 py-6 my-8 font-bold text-base rounded-full text-white">
                  Daftar Afiliator
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
        BAGIAN FAQ AFFILIATE BARU (Sesuai Permintaan)
        ------------------------------------------------------------- 
      */}
      <section className="py-10">
        <div className="mx-auto max-w-3xl px-4">
          {/* Title Baru untuk FAQ Affiliate */}
          <h2 className="text-center text-2xl md:text-3xl font-extrabold text-emerald-900 mb-8">
            Pertanyaan yang Sering Diajukan (Affiliate)
          </h2>

          {/* Accordions FAQ Affiliate */}
          <div className="mt-6 space-y-3">
            {loadingFaq ? (
              <div className="text-center py-10">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p>Memuat FAQ Affiliate...</p>
              </div>
            ) : errorFaq ? (
              <div className="text-center py-10 text-error">
                <p>{errorFaq}</p>
              </div>
            ) : faqData.length > 0 ? (
              faqData.map((faqItem) => (
                <AffiliateFaqAccordion key={faqItem.id} faqItem={faqItem} />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>
                  Belum ada pertanyaan yang tersedia untuk Affiliate saat ini.
                </p>
              </div>
            )}
          </div>

          {/* CTA (Dibiarkan sama) */}
          <div className="mt-6 flex justify-center">
            <Link href="/#">
              <button className="btn bg-primary hover:bg-green-950 px-8 py-6 my-8 font-bold text-base rounded-full text-white">
                Selengkapnya
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* BAGIAN FAQ LAMA ASLI DIHAPUS, DIGANTIKAN DENGAN IMPLEMENTASI BARU */}
    </div>
  );
};

export default Afiliator;
