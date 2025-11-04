"use client";

// src/pages/articles.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

// --- 1. Definisi Tipe Data (Interface) ---
interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  status: "published" | "draft";
}

// Fungsi utilitas untuk membersihkan tag HTML dari excerpt
const cleanExcerpt = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  // Mengambil 150 karakter pertama
  return (
    (div.textContent || div.innerText || "").trim().substring(0, 150) + "..."
  );
};

// --- 2. Komponen Card Artikel Sederhana (Grid) ---
const ArticleGridCard: React.FC<{ article: Article }> = ({ article }) => (
  <Link
    href={`/articles/${article.slug}`}
    className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white"
  >
    {" "}
    <img
      src={article.thumbnail}
      alt={article.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <span className="inline-block text-xs font-semibold py-1 px-2 rounded-sm text-white bg-green-800 uppercase mb-2">
        {article.category}
      </span>

      <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2">
        {article.title}
      </h3>
      <button
        className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors mt-2"
        onClick={() => console.log("Go to article:", article.slug)}
      >
        Selengkapnya
      </button>
    </div>
  </Link>
);

// --- 3. Komponen Card Artikel Utama (Hero) ---
const ArticleHeroCard: React.FC<{ article: Article }> = ({ article }) => (
  <div className="grid md:grid-cols-2 bg-white rounded-lg overflow-hidden shadow-xl mb-12">
    {/* Gambar Kiri */}
    <div className="h-96 w-full">
      <img
        src={article.thumbnail}
        alt={article.title}
        className="w-full h-full object-cover"
      />
    </div>

    {/* Konten Kanan (Sesuai Desain: Background Hijau) */}
    <div className="p-8 flex flex-col justify-between bg-green-700 text-white">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold mb-3">
          {article.title}
        </h2>
        <p className="text-sm opacity-90 line-clamp-4">
          {cleanExcerpt(article.excerpt)}
        </p>
      </div>

      <div className="mt-6">
        <button
          className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded transition-colors mr-4"
          onClick={() => console.log("Go to article:", article.slug)}
        >
          Selengkapnya
        </button>

        {/* Navigasi PREV/NEXT (dummy) */}
        <div className="inline-flex space-x-2">
          <button className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded transition-colors">
            PREV
          </button>
          <button className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded transition-colors">
            NEXT
          </button>
        </div>
      </div>
    </div>
  </div>
);

// --- 4. Halaman Utama (articles) ---
const articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6; // Untuk grid 2x3

  // Ganti dengan endpoint API yang sebenarnya
  const API_URL = "https://ts.crx.my.id/api/articles"; // Contoh URL API dummy atau yang sebenarnya

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        // --- Menggunakan Axios untuk API Call ---
        // Asumsi struktur respons: { data: Article[] }
        const response = await axios.get<{ data: Article[] }>(API_URL);

        // Memastikan data yang diterima adalah array
        if (Array.isArray(response.data.data)) {
          setArticles(response.data.data);
        } else {
          throw new Error("Invalid data structure received from API.");
        }

        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            `Gagal mengambil artikel: ${err.message}. Pastikan API URL benar.`
          );
        } else {
          setError("Terjadi kesalahan tak terduga saat memuat data.");
        }
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [API_URL]);

  // Ambil artikel utama (pertama) dan sisanya untuk grid
  const heroArticle = articles.length > 0 ? articles[0] : null;
  const articlesForGridSource = articles.slice(1); // Mulai dari artikel kedua

  // Logika Pagination
  const totalPages = Math.ceil(articlesForGridSource.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const articlesForGrid = articlesForGridSource.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll ke atas grid saat pindah halaman untuk visibilitas
      window.scrollTo({ top: 350, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-green-700 font-semibold">
            Memuat artikel...
          </p>
          {/* Tambahkan spinner sederhana jika perlu */}
          <div className="mt-4 w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-100 border border-red-400 rounded-lg m-4">
        <h1 className="text-2xl font-bold mb-2">🚨 Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* 4.1. Artikel Utama (Hero Section) */}
      {heroArticle && <ArticleHeroCard article={heroArticle} />}

      {/* 4.2. Grid Artikel */}
      <section className="py-6">
        {articlesForGrid.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlesForGrid.map((article) => (
              // Menggunakan ID dan slug sebagai kunci unik yang lebih baik
              <ArticleGridCard
                key={`${article.id}-${article.slug}`}
                article={article}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Tidak ada artikel di halaman ini.
          </p>
        )}
      </section>

      {/* 4.3. Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          {/* Tombol Sebelumnya */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 border rounded-full transition-colors ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            &larr;
          </button>

          {/* Tombol Halaman */}
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`py-2 px-4 rounded-full font-bold transition-colors ${
                  pageNumber === currentPage
                    ? "bg-green-600 text-white" // Active
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300" // Inactive
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Tombol Berikutnya */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 border rounded-full transition-colors ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default articles;
