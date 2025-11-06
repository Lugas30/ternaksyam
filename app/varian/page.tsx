"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

// Ambil variabel environment (Pastikan ini didefinisikan di .env.local atau di mana pun Anda menyimpannya)
// Asumsi API_URL dan API_IMAGE_URL sudah didefinisikan di file env/lingkungan React Anda.
// Jika ini adalah Next.js, ini akan berfungsi dengan baik.
const API_URL = "https://ts.crx.my.id/api"; // Ganti jika Anda memiliki URL dasar yang berbeda
const API_IMAGE_URL = "https://ts.crx.my.id/storage"; // Ini perlu dicocokkan dengan base url untuk gambar

// -------------------------------------------
// 1. DEFINISI TIPE DATA (disesuaikan dengan API)
// -------------------------------------------

// Tipe untuk Ukuran (Size) dari API
interface BrandSize {
  id: number;
  brand_id: number;
  size: string; // Misal: "250 Gram"
  created_at: string;
  updated_at: string;
}

// Tipe untuk Varian (Variant) dari API
interface BrandVariant {
  id: number;
  brand_id: number;
  variant: string; // Nama varian, misal: "Goata Original"
  image: string; // Path gambar, misal: "brand_variants/image.png"
  description: string; // Deskripsi HTML varian
  created_at: string;
  updated_at: string;
}

// Tipe untuk Produk/Brand (Product/Brand) dari API
interface Brand {
  id: number;
  brand: string; // Nama produk/brand, misal: "Goata"
  slug: string; // Field slug untuk link, misal: "goata"
  description: string; // Deskripsi HTML produk
  image: string; // Path gambar utama, misal: "brands/image.png"
  created_at: string;
  updated_at: string;
  sizes: BrandSize[]; // Array ukuran yang tersedia
  variants: BrandVariant[]; // Array varian rasa/tipe
}

// Hapus fungsi createSlug dan data dummy

// -------------------------------------------
// 4. KOMPONEN UTAMA (ProductPage)
// -------------------------------------------

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fungsi untuk mengambil data dari API
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<{ data: Brand[] }>(
          `${API_URL}/brands`
        );
        // Data produk ada di 'response.data.data'
        setProducts(response.data.data);
      } catch (err) {
        console.error("Gagal mengambil data produk:", err);
        setError("Gagal memuat data produk. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /**
   * Sub-Komponen untuk Thumbnail Varian Rasa
   */
  const VariantThumbnail: React.FC<{ variant: BrandVariant }> = ({
    variant,
  }) => (
    // Mengubah w-20 h-auto menjadi w-16 h-auto pada mobile, dan w-20 h-auto pada md
    <div className="flex flex-col items-center p-1">
      <div className="w-16 md:w-20 h-auto bg-white rounded-lg overflow-hidden  hover:shadow-lg transition duration-200 cursor-pointer">
        <img
          // Menggabungkan base URL gambar dengan path dari API
          src={`${API_IMAGE_URL}/${variant.image}`}
          alt={`Varian ${variant.variant}`}
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  );

  /**
   * Sub-Komponen untuk setiap Blok Produk
   */
  const ProductBlock: React.FC<{ product: Brand; isLast: boolean }> = ({
    product,
    isLast,
  }) => {
    // Link tujuan menggunakan slug
    const productUrl = `/product/${product.slug}`;
    const mainImageUrl = `${API_IMAGE_URL}/${product.image}`;

    return (
      <div className="py-8 md:py-10">
        {/* 1. Detail Utama Produk */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Gambar Utama */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            {/* Mengatur agar gambar lebih kecil di mobile */}
            <div className="w-4/5 sm:w-2/3 md:w-full h-auto ">
              <img
                src={mainImageUrl}
                alt={`Produk ${product.brand}`}
                className="object-contain w-full h-full"
              />
            </div>
          </div>

          {/* Deskripsi & Ukuran */}
          <div className="w-full md:w-2/3">
            {/* **Penyesuaian Font Size:** text-2xl/3xl pada mobile, text-4xl pada desktop */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3 md:mb-4 leading-tight">
              {product.brand}
            </h2>

            {/* Deskripsi - Menggunakan dangerouslySetInnerHTML karena data API berupa string HTML */}
            {/* **Penyesuaian Font Size:** text-sm/base pada mobile, text-base/lg pada desktop */}
            <div
              className="text-sm sm:text-base text-gray-600 mb-4 md:mb-6 text-justify leading-relaxed"
              // PERINGATAN: Gunakan ini hanya jika Anda yakin kontennya aman (dari sumber terpercaya)
              dangerouslySetInnerHTML={{ __html: product.description }}
            />

            {/* Ukuran */}
            {/* **Penyesuaian Font Size:** text-base pada mobile, text-lg pada desktop */}
            <p className="font-bold text-base md:text-lg text-gray-700 mt-3 md:mt-4 mb-1 md:mb-2">
              Tersedia dalam ukuran :
            </p>
            <ul className="list-none space-y-1 text-gray-600">
              {/* **Penyesuaian Font Size:** text-sm pada mobile, text-base pada desktop */}
              {product.sizes.map((size) => (
                // Menggunakan size.id sebagai key
                <li key={size.id} className="text-sm md:text-base font-medium">
                  {size.size}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 2. Bagian Varian Rasa */}
        <div className="mt-8 md:mt-12">
          {/* **Penyesuaian Font Size:** text-xl pada mobile, text-2xl pada desktop */}
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 border-b border-gray-200 pb-2">
            Varian
          </h3>

          {/* Thumbnail Varian */}
          <div className="flex flex-wrap gap-4 justify-start">
            {product.variants.map((variant) => (
              <VariantThumbnail key={variant.id} variant={variant} />
            ))}
          </div>

          {/* Tombol Selengkapnya */}
          <div className="mt-6 md:mt-8">
            {/* **Penyesuaian Font Size & Padding:** px-6 py-2 (mobile), px-8 py-3 (desktop) */}
            <Link
              href={productUrl}
              className="inline-block px-6 py-2 md:px-8 md:py-3 bg-primary text-white font-semibold text-base md:text-lg rounded-full shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 no-underline text-center"
            >
              Tentang {product.brand}
            </Link>
          </div>
        </div>
        {/* Divider antar produk, kecuali produk terakhir */}
        {!isLast && <hr className="my-8 md:my-10 border-t border-gray-200" />}
      </div>
    );
  };

  // Render utama komponen ProductPage
  return (
    // **Penyesuaian Padding Halaman:** p-4 pada mobile, sm:p-12 pada desktop
    <div className="min-h-screen bg-white p-4 sm:p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header Halaman */}
        <header className="mb-8 md:mb-12">
          {/* **Penyesuaian Font Size:** text-4xl pada mobile, text-5xl pada desktop */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-primary tracking-tight">
            Brand Kami
          </h1>
        </header>

        <main>
          {/* Tampilkan Loading State */}
          {loading && (
            <div className="text-center py-10 text-xl text-gray-500">
              Memuat data produk...
            </div>
          )}

          {/* Tampilkan Error State */}
          {error && (
            <div className="text-center py-10 text-xl text-red-600 border border-red-300 bg-red-50 p-4 rounded-lg">
              ❌ **Error:** {error}
            </div>
          )}

          {/* Konten Produk Utama (Looping data dari API) */}
          {!loading &&
            !error &&
            products.length > 0 &&
            products.map((product, index) => (
              <ProductBlock
                key={product.id}
                product={product}
                isLast={index === products.length - 1} // Cek produk terakhir untuk divider
              />
            ))}

          {/* Tampilkan No Data State */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-10 text-xl text-gray-500">
              Tidak ada data produk yang tersedia.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
