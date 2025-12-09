"use client";

import React from "react";
import Image from "next/image";
import susu from "@/public/images/group_milk.png";
import Link from "next/link";
import axios from "axios";

// --- Interface untuk Benefit (dari kode sebelumnya) ---
interface Benefit {
  id: number;
  type: string;
  thumbnail: string;
  benefit: string;
  status: string;
}

// --- Interface untuk FAQ (berdasarkan struktur API) ---
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  target: "user" | "reseller" | "affiliate" | "all";
  status: string;
}

const Reseller = () => {
  const [benefits, setBenefits] = React.useState<Benefit[]>([]);
  const [faqs, setFaqs] = React.useState<FAQItem[]>([]); // State untuk FAQ
  const [loadingFaq, setLoadingFaq] = React.useState(true); // State untuk loading FAQ

  // Konstanta URL dari .env
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 1. Fetch Benefits
  React.useEffect(() => {
    const getBenefits = async () => {
      try {
        if (!API_URL) return;
        const response = await axios.get(`${API_URL}/benefit/resellers`);
        if (response.data && response.data.data) {
          setBenefits(response.data.data);
        } else {
          console.error(
            "Struktur data Benefit API tidak sesuai atau data kosong:",
            response.data
          );
        }
      } catch (error) {
        console.error("Gagal mengambil data benefit:", error);
      }
    };
    getBenefits();
  }, [API_URL]);

  // 2. Fetch dan Filter FAQ untuk target "reseller"
  React.useEffect(() => {
    const getFaqs = async () => {
      setLoadingFaq(true);
      try {
        const response = await axios.get(`${API_URL}/faqs`);
        if (response.data && Array.isArray(response.data)) {
          // Filter data hanya untuk target "reseller" dan status "show"
          const filteredFaqs = response.data.filter(
            (item: FAQItem) =>
              item.target === "reseller" && item.status === "show"
          );
          setFaqs(filteredFaqs);
        } else {
          console.error(
            "Struktur data FAQ API tidak sesuai atau bukan array:",
            response.data
          );
        }
      } catch (error) {
        console.error("Gagal mengambil data FAQ:", error);
      } finally {
        setLoadingFaq(false);
      }
    };
    getFaqs();
  }, []);

  return (
    <div className="container mx-auto px-3 md:px-5 lg:px-10">
      {/* 1. SECTION HERO */}
      <section className="relative mb-20">
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
          <div className="hero min-h-screen bg-neutral bg-linear-to-b from-neutral to-[#187863] overflow-hidden">
            <div className="hero-content flex-col lg:flex-row-reverse z-10 max-w-6xl mx-auto">
              {/* Gambar produk */}
              <Image
                src={susu}
                alt="Produk Etawa"
                width={500}
                height={500}
                className="my-10 p-3 "
              />

              {/* Teks */}
              <div className="text-white lg:mr-10">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Siap mulai jadi reseller dan punya penghasilan sendiri?
                </h1>
                <p className="py-6 text-green-100 text-lg">
                  Daftar sekali, cuan berkali-kali!
                </p>
                <Link href="/daftar-reseller">
                  <button className="btn btn-primary hover:bg-secondary border-none px-8 py-6 my-8 font-bold text-base rounded-full">
                    Daftar Reseller
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION BENEFITS */}
      <section className="my-20">
        <h3 className="text-2xl md:text-3xl text-center font-bold leading-tight mb-10">
          Kenapa Harus Jadi Reseller TernakSyams
        </h3>

        {/* Placement Benefits - Menggunakan data dari API */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {benefits.map((item) => (
            <div
              key={item.id}
              className="card w-auto bg-base-100 shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <div className="card-body items-center text-center p-4">
                <Image
                  src={item.thumbnail}
                  alt={item.benefit}
                  width={64}
                  height={64}
                  className="mb-3 w-16 h-16 object-contain"
                  unoptimized={true}
                />
                <span className="text-sm font-medium text-gray-700">
                  {item.benefit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SECTION PRICE LIST */}
      <section className="my-20">
        <h3 className="text-2xl md:text-3xl text-center font-bold leading-tight mb-10">
          Price List
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <img
              src="https://placehold.co/500x500"
              alt="Paket Etawa"
              className="w-full"
            ></img>
          </div>
          <div>
            <img
              src="https://placehold.co/500x500"
              alt="Paket Etawa"
              className="w-full"
            ></img>
          </div>
          <div>
            <img
              src="https://placehold.co/500x500"
              alt="Paket Etawa"
              className="w-full"
            ></img>
          </div>
        </div>
        {/* <p className="text-sm text-center my-5">
          Note : untuk pengiriman saat ini ke alamat reseller, total pembelian
          belum termasuk BEBAN ONGKIR
        </p> */}
      </section>

      {/* 4. SECTION TESTIMONIALS */}
      <section className="my-20 py-20 bg-stone-200 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div className="container mx-auto px-3 md:px-5 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="card w-auto min-h-72 md:min-h-80 bg-base-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary rounded-bl-full flex items-center justify-center">
              <img
                src={"/images/kutip.svg"}
                className="mb-3 ml-3 object-contain"
                alt="Ikon Kutipan"
              />
            </div>

            <div className="card-body relative flex flex-col justify-between">
              <p className="text-sm grow flex items-center justify-center text-center mt-16">
                Berkat ngonten affiliates aku berhasil beli iPhone 13 Pro Max
                buat menunjang bikin konten dan juga bisa renovasi kamar serta
                taman rumah.
              </p>

              <div className="flex items-center">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img
                      src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
                      alt="Avatar Yelling Cat"
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="font-semibold">Yelling Cat</p>
                  <span className="text-xs text-gray-500">@yellingwoman</span>
                </div>
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="card w-auto min-h-72 md:min-h-80 bg-base-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary rounded-bl-full flex items-center justify-center">
              <img
                src={"/images/kutip.svg"}
                className="mb-3 ml-3 object-contain"
                alt="Ikon Kutipan"
              />
            </div>

            <div className="card-body relative flex flex-col justify-between">
              <p className="text-sm grow flex items-center justify-center text-center mt-16">
                Berkat ngonten affiliates aku berhasil beli iPhone 13 Pro Max
                buat menunjang bikin konten dan juga bisa renovasi kamar serta
                taman rumah.
              </p>

              <div className="flex items-center">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img
                      src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
                      alt="Avatar Yelling Cat"
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="font-semibold">Yelling Cat</p>
                  <span className="text-xs text-gray-500">@yellingwoman</span>
                </div>
              </div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="card w-auto min-h-72 md:min-h-80 bg-base-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary rounded-bl-full flex items-center justify-center">
              <img
                src={"/images/kutip.svg"}
                className="mb-3 ml-3 object-contain"
                alt="Ikon Kutipan"
              />
            </div>

            <div className="card-body relative flex flex-col justify-between">
              <p className="text-sm grow flex items-center justify-center text-center mt-16">
                Berkat ngonten affiliates aku berhasil beli iPhone 13 Pro Max
                buat menunjang bikin konten dan juga bisa renovasi kamar serta
                taman rumah.
              </p>

              <div className="flex items-center">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img
                      src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
                      alt="Avatar Yelling Cat"
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="font-semibold">Yelling Cat</p>
                  <span className="text-xs text-gray-500">@yellingwoman</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION CTA BANNER */}
      <section className="my-20">
        <div className="hero min-h-28 bg-neutral bg-linear-to-b from-neutral to-[#187863] relative overflow-hidden rounded-2xl">
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
              <Link href="/daftar-reseller">
                <button className="btn btn-primary hover:bg-secondary border-none px-8 py-6 my-8 font-bold text-base rounded-full text-white">
                  Daftar Reseller
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION SYARAT & KETENTUAN */}
      <section className="my-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm">
            <div className="p-6 md:p-8">
              {/* Badge/Title */}
              <div className="flex justify-center">
                <h2 className="inline-block rounded-full bg-emerald-800 px-6 py-3 text-center text-white text-lg md:text-xl font-semibold shadow-sm">
                  Syarat & Ketentuan
                </h2>
              </div>

              {/* List */}
              <ol className="mt-6 list-decimal space-y-2 pl-6 text-sm md:text-base text-base-content/80">
                <li>Minimal pembelian 10kg setiap varian.</li>
                <li>
                  Pembelian tidak dapat di mix, harus menyesuaikan dengan
                  minimal pembelian yang sudah ditentukan.
                </li>
                <li>
                  Pada setiap transaksi pembelian reseller, harus mengikuti
                  minimal pembelian untuk mendapatkan potongan harga reseller.
                  Jika tidak mengikuti min pembelian, maka tidak mendapatkan
                  potongan harga.
                </li>
                <li>Reseller dilarang menjual di bawah harga pusat.</li>
                <li>
                  Harga sewaktu-waktu akan berubah mengikuti kenaikan bahan
                  baku.
                </li>
                <li>Harga belum termasuk ongkos kirim.</li>
                <li>
                  Dropship tidak ada harga khusus, mengikuti harga normal pusat.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION FAQ DARI API (RESELLER ONLY) */}
      <section className="my-20">
        <div className="mx-auto max-w-3xl px-4">
          {/* Title */}
          <h2 className="text-center mb-10 text-2xl md:text-3xl font-extrabold text-emerald-900">
            Pertanyaan yang Sering Diajukan (Reseller)
          </h2>

          {/* Accordions */}
          <div className="mt-6 space-y-3">
            {loadingFaq ? (
              <div className="text-center p-10 text-lg">
                Memuat FAQ Reseller...
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center p-10 text-lg text-gray-500">
                Tidak ada data FAQ untuk Reseller saat ini.
              </div>
            ) : (
              faqs.map((item, index) => (
                // Menggunakan 'collapse-arrow' untuk ikon panah di kanan
                <div
                  key={item.id}
                  className="collapse collapse-arrow bg-gray-200 rounded-xl shadow-sm"
                >
                  <input
                    type="checkbox"
                    className="peer"
                    id={`faq-${item.id}`}
                  />
                  <label
                    htmlFor={`faq-${item.id}`}
                    className="collapse-title text-base md:text-lg font-medium"
                  >
                    {item.question}
                  </label>
                  <div className="collapse-content text-sm md:text-base text-base-content/80">
                    {/* Menggunakan dangerouslySetInnerHTML untuk merender jawaban yang mungkin mengandung HTML/text formatting */}
                    <p dangerouslySetInnerHTML={{ __html: item.answer }} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CTA */}
          <div className="mt-6 flex justify-center">
            <Link href="/#">
              <button className="btn bg-primary hover:bg-green-950 px-8 py-6 my-8 font-bold text-base rounded-full text-white">
                Selengkapnya
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reseller;
