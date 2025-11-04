"use client";

// src/pages/articles.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

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

// --- Mock API Response (menggantikan pemanggilan API langsung) ---
const mockApiResponse = {
  data: [
    // Artikel Utama (Hero)
    {
      id: 4,
      title: "Manfaat olah raga rutin dan konsumsi susu kambing etawa",
      slug: "manfaat-olah-raga-rutin-dan-konsumsi-susu-kambing-etawa",
      category: "Lifestyle",
      excerpt:
        "<div>Di tengah kesibukan sehari-hari, menjaga kesehatan menjadi prioritas utama. Kombinasi gaya hidup aktif dengan nutrisi yang tepat adalah resep sempurna. Salah satu kombinasi yang patut dipertimbangkan adalah <strong>olahraga rutin</strong> yang dipadukan dengan konsumsi <strong>susu kambing etawa</strong>. Kedua hal ini menawarkan manfaat sinergis yang luar biasa bagi tubuh Anda.&nbsp;</div>",
      content: "...",
      thumbnail:
        "https://ts.crx.my.id/storage/articles/QWRFyuVw1sQFtiwsRJCCmicrdPWbkc4mt70PTr58.png",
      status: "published",
    },
    // Artikel Grid 1
    {
      id: 3,
      title: "Chikungunya di Cianjur: Nyeri Sendi Bikin Tak Mampu Berdiri",
      slug: "chikungunya-di-cianjur-nyeri-sendi-bikin-tak-mampu-berdiri",
      category: "Edukasi",
      excerpt:
        "<div><strong><em>Kasus Chikungunya di Cianjur makin naik! Nyeri sendinya bikin gerak terbatas bahkan ada yang gak mampu bangun dari tempat tidur.</em></strong></div>",
      content: "...",
      thumbnail:
        "https://ts.crx.my.id/storage/articles/BQNHKZpgcFZrysQ0IOiSilXeY7OA0AuiHPxY0kdK.png",
      status: "published",
    },
    // Artikel Grid 2
    {
      id: 2,
      title:
        "Sering Nyeri Lutut atau Kaku Sendi? Bisa Jadi Tanda Radang Sendi!",
      slug: "sering-nyeri-lutut-atau-kaku-sendi-bisa-jadi-tanda-sendi",
      category: "Edukasi",
      excerpt:
        "<div><em>Nyeri lutut saat berjalan atau sendi kaku saat bangun tidur? Bisa jadi tanda awal radang sendi. Kenali gejalanya sejak dini agar lebih mudah diatasi dengan baca selengkapnya di sini!</em></div>",
      content: "...",
      thumbnail:
        "https://ts.crx.my.id/storage/articles/8poSrQEXMfPMPIa3lBQ4OfouFxsm7r4rD1bNv1ey.png",
      status: "published",
    },
    // Artikel Grid 3
    {
      id: 1,
      title:
        "Benarkah Jahe Bisa Membantu Meredakan Asam Urat? Ini Penjelasannya",
      slug: "benarkah-jahe-bisa-membantu-meredakan-asam-urat-ini-penjelasannya",
      category: "Lifestyle",
      excerpt:
        "<div><em>Jahe dipercaya bantu redakan gejala asam urat seperti nyeri dan kaku pada sendi. Cari tahu manfaat lengkapnya di artikel ini! Baca selengkapnya!</em></div>",
      content: "...",
      thumbnail:
        "https://ts.crx.my.id/storage/articles/eE92t9om9nQCL5y88BurfX7EyRiK0cXn5M0VjCaJ.jpg",
      status: "published",
    },
    // Duplikasi data untuk mengisi slot grid
    {
      id: 5,
      title: "Manfaat olah raga rutin dan konsumsi susu kambing etawa",
      slug: "manfaat-olah-raga-rutin-dan-konsumsi-susu-kambing-etawa-copy1",
      category: "Lifestyle",
      excerpt:
        "<div>Manfaat olah raga rutin dan konsumsi susu kambing etawa, lorem ipsum dolor ...</div>",
      content: "...",
      thumbnail:
        "https://ts.crx.my.id/storage/articles/QWRFyuVw1sQFtiwsRJCCmicrdPWbkc4mt70PTr58.png",
      status: "published",
    },
    {
      id: 6,
      title: "Manfaat olah raga rutin dan konsumsi susu kambing etawa",
      slug: "manfaat-olah-raga-rutin-dan-konsumsi-susu-kambing-etawa-copy2",
      category: "Lifestyle",
      excerpt:
        "<div>Manfaat olah raga rutin dan konsumsi susu kambing etawa, lorem ipsum dolor ...</div>",
      content: "...",
      thumbnail:
        "https://ts.crx.my.id/storage/articles/QWRFyuVw1sQFtiwsRJCCmicrdPWbkc4mt70PTr58.png",
      status: "published",
    },
    {
      id: 7,
      title: "Manfaat olah raga rutin dan konsumsi susu kambing etawa",
      slug: "manfaat-olah-raga-rutin-dan-konsumsi-susu-kambing-etawa-copy3",
      category: "Lifestyle",
      excerpt:
        "<div>Manfaat olah raga rutin dan konsumsi susu kambing etawa, lorem ipsum dolor ...</div>",
      content: "...",
      thumbnail:
        "https://ts.crx.my.id/storage/articles/QWRFyuVw1sQFtiwsRJCCmicrdPWbkc4mt70PTr58.png",
      status: "published",
    },
    {
      id: 8,
      title: "Manfaat olah raga rutin dan konsumsi susu kambing etawa",
      slug: "manfaat-olah-raga-rutin-dan-konsumsi-susu-kambing-etawa-copy4",
      category: "Lifestyle",
      excerpt:
        "<div>Manfaat olah raga rutin dan konsumsi susu kambing etawa, lorem ipsum dolor ...</div>",
      content: "...",
      thumbnail:
        "https://ts.crx.my.id/storage/articles/QWRFyuVw1sQFtiwsRJCCmicrdPWbkc4mt70PTr58.png",
      status: "published",
    },
    {
      id: 9,
      title: "Manfaat olah raga rutin dan konsumsi susu kambing etawa",
      slug: "manfaat-olah-raga-rutin-dan-konsumsi-susu-kambing-etawa-copy5",
      category: "Lifestyle",
      excerpt:
        "<div>Manfaat olah raga rutin dan konsumsi susu kambing etawa, lorem ipsum dolor ...</div>",
      content: "...",
      thumbnail:
        "https://ts.crx.my.id/storage/articles/QWRFyuVw1sQFtiwsRJCCmicrdPWbkc4mt70PTr58.png",
      status: "published",
    },
  ],
};

// Fungsi utilitas untuk membersihkan tag HTML dari excerpt
const cleanExcerpt = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  // Mengambil 50 karakter pertama
  return (
    (div.textContent || div.innerText || "").trim().substring(0, 80) + "..."
  );
};

// --- 2. Komponen Card Artikel Sederhana (Grid) ---
const ArticleGridCard: React.FC<{ article: Article }> = ({ article }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white">
    <img
      src={article.thumbnail}
      alt={article.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <p className="text-xs font-semibold text-green-600 uppercase mb-2">
        CATEGORY
      </p>
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
  </div>
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

        {/* Navigasi PREV/NEXT seperti di gambar (hanya dummy button) */}
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6; // Untuk grid 2x3

  useEffect(() => {
    const fetchArticles = async () => {
      // Ganti dengan URL API yang sebenarnya
      const API_URL = "https://ts.crx.my.id/api/articles";

      try {
        // --- Simulasi API Call dengan Axios ---
        // const response = await axios.get<{ data: Article[] }>(API_URL);
        // setArticles(response.data.data);

        // --- Menggunakan Mock Data ---
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulasi delay API
        setArticles(mockApiResponse.data as Article[]);
      } catch (err) {
        console.error("Error fetching articles:", err);
        // Lakukan penanganan error yang lebih baik di aplikasi nyata
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Ambil artikel utama (pertama)
  const heroArticle = articles.length > 0 ? articles[0] : null;

  // Logika Pagination untuk Grid
  const articlesForGridSource = articles.slice(1); // Mulai dari artikel kedua
  const totalPages = Math.ceil(articlesForGridSource.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const articlesForGrid = articlesForGridSource.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll ke atas halaman saat pindah halaman
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-gray-700">Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* 4.1. Artikel Utama (Hero Section) */}
      {heroArticle && <ArticleHeroCard article={heroArticle} />}

      {/* 4.2. Grid Artikel */}
      <section className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articlesForGrid.map((article) => (
            <ArticleGridCard
              key={article.id + "-" + article.slug}
              article={article}
            />
          ))}
        </div>
      </section>

      {/* 4.3. Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          {/* Tombol Sebelumnya */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 border rounded-full ${
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
            className={`p-2 border rounded-full ${
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
