"use client";

import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import axios from "axios";
import { useParams } from "next/navigation"; // Asumsi Next.js 13+ App Router

// --- Konfigurasi API (Asumsi Environment Variable) ---
// Harap pastikan variabel ini diatur di file .env.local Anda
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ts.crx.my.id/api/brand";
const API_IMAGE_URL =
  process.env.NEXT_PUBLIC_API_IMAGE_URL || "https://ts.crx.my.id/storage/";

// --- Tipe Data (Disesuaikan dengan kebutuhan rendering) ---
interface Product {
  name: string;
  imageURL: string;
  badge?: "Best Seller" | string;
  type: string;
  priceFrom: string;
  reviews: string;
  linkText: string;
  linkURL: string;
  isGoataProduct: boolean;
}

interface BrandData {
  hero: {
    title: string;
    subtitle: string;
    ctaShop: string;
    ctaShopURL: string;
    ctaSubscribe: string;
    ctaSubscribeURL: string;
    heroImageURL: string;
    imageAlt: string;
  };
  testimonial: { quote: string };
  reviews: {
    count: string;
    text: string;
    linkText: string;
    linkURL: string;
    reviewBgColor: string;
  };

  features: string[];
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  productSectionTitle: string;
  accentTextColor?: string;

  productSidebar: {
    headline: string;
    description: string;
    ctaText: string;
    ctaURL: string;
  };

  products: Product[];

  aboutSection: {
    title: string;
    description: string;
    ctaText: string;
    ctaURL: string;
    imageURL: string;
  };
  howItWorks: {
    tagline: string;
    headline: string[];
    steps: string[];
    ctaText: string;
    ctaURL: string;
    imageURL: string;
  };
}

// --- Tipe Data API (Hanya bagian yang digunakan untuk mapping) ---
interface ApiProductVariant {
  id: number;
  variant: string;
  image: string;
  description: string;
}

interface ApiDataResponse {
  data: {
    brand: string;
    image: string;
    variants: ApiProductVariant[];
    detail: { herotitle: string; herosubtitle: string; banner: string };
    testimonial: {
      quotes: string;
      textreview: string;
      textcta: string;
      linkcta: string;
      cardcolor: string;
      textcolor: string;
    };
    feature: {
      marquebgcolor: string;
      marquetextcolor: string;
      features: string;
    };
    productsidebar: {
      headline: string;
      description: string;
      ctatext: string;
      ctalink: string;
    };
    about: {
      title: string;
      description: string;
      image: string;
      ctatext: string;
      ctalink: string;
    };
    howitwork: {
      tagline: string;
      image: string;
      headline: string;
      steps: string;
      ctatext: string;
      ctalink: string;
    };
  };
}

// Helper untuk bintang 5
const FiveStars: React.FC = () => (
  <div className="flex text-yellow-400">{"★".repeat(5)}</div>
);

// Opsi Embla Carousel
const EMBLA_OPTIONS = {
  align: "start",
  dragFree: true,
  containScroll: "keepSnaps",
} as const;

// Komponen Produk Card
const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="embla__slide relative min-w-[280px] md:min-w-[320px] lg:min-w-[300px] bg-white border border-gray-100 rounded-lg shadow-sm p-4 mr-4 shrink-0">
    {product.badge && (
      <span
        className={`absolute btn btn-circle top-0 right-0 m-2 p-8 text-xs ${
          product.badge === "Best Seller"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {product.badge}
      </span>
    )}
    <div className="bg-gray-50 rounded-md mb-3 h-80 flex justify-center items-center">
      <img
        src={product.imageURL}
        alt={product.name}
        className="max-h-full object-contain rounded-md"
      />
    </div>
    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
    <p className="text-sm text-gray-500 mb-2">{product.type}</p>
    <div className="flex items-center justify-between text-sm mb-4">
      <div className="flex items-center">
        <FiveStars />
        <span className="ml-2 text-gray-600">{product.reviews}</span>
      </div>
      <p className="font-bold text-green-600">{product.priceFrom}</p>
    </div>
    <Link
      href={product.linkURL}
      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-150"
    >
      {product.linkText} →
    </Link>
  </div>
);

// --- Komponen BrandProfile Utama ---
const BrandProfile: React.FC = () => {
  const params = useParams();
  const slug = params.slug as string;

  // State
  const [data, setData] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [emblaRef] = useEmblaCarousel(EMBLA_OPTIONS);

  // 💡 PERBAIKAN ERROR: Definisikan sectionPaddingClass di sini
  const sectionPaddingClass = "px-4 md:px-6 lg:px-12";

  // Helper untuk membersihkan tag HTML (dari API)
  const cleanHtmlAndSplit = (
    htmlContent: string,
    delimiter: string = "<br>"
  ): string[] => {
    if (!htmlContent) return [];

    // Hapus semua tag HTML (kecuali yang digunakan untuk pemisah)
    let cleanText = htmlContent.replace(/<\/?(div|p|ul|li|strong)[^>]*>/g, "");

    // Hapus &#92;n atau &amp;nbsp;
    cleanText = cleanText.replace(/&#92;n|&amp;nbsp;/g, " ").trim();

    // Pisahkan berdasarkan delimiter (misalnya <br> atau baris baru)
    return cleanText
      .split(new RegExp(delimiter, "i"))
      .map((item) => item.replace(/<[^>]+>/g, "").trim()) // Bersihkan lagi jika ada tag sisa
      .filter((item) => item.length > 0);
  };

  // Helper untuk mendapatkan URL gambar lengkap
  const getImageUrl = (path: string | undefined): string => {
    if (!path || path.includes("http"))
      return path || "https://placehold.co/800x800.png";
    return `${API_IMAGE_URL}${path}`;
  };

  // --- Data Fetching ---
  useEffect(() => {
    if (!slug) {
      setError("Slug tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<ApiDataResponse>(
          `${API_URL}/brand/${slug}`
        );
        const apiResponse = response.data.data;

        // --- Pemetaan Data ---
        const mappedData: BrandData = {
          hero: {
            title:
              apiResponse.detail?.herotitle ||
              `Selamat Datang di ${apiResponse.brand}`,
            subtitle:
              apiResponse.detail?.herosubtitle ||
              `Detail untuk brand ${apiResponse.brand}`,
            ctaShop: "Belanja Sekarang",
            ctaShopURL: `/${slug}/shop`,
            ctaSubscribe: "Lihat Manfaat",
            ctaSubscribeURL: `/${slug}/benefits`,
            heroImageURL: getImageUrl(
              apiResponse.detail?.banner || apiResponse.image
            ),
            imageAlt: `Hero image for ${apiResponse.brand}`,
          },
          testimonial: {
            // Hapus kutip ganda dari quotes
            quote:
              apiResponse.testimonial?.quotes.replace(/"/g, "") ||
              "Belum ada testimonial.",
          },
          reviews: {
            count:
              apiResponse.testimonial?.textreview ||
              "0+ keluarga telah memilih",
            text: "Five Star Reviews",
            linkText: apiResponse.testimonial?.textcta || "Lihat ulasan",
            linkURL: apiResponse.testimonial?.linkcta || "/reviews",
            reviewBgColor: apiResponse.testimonial?.cardcolor || "#193cb8",
          },
          // Pisahkan fitur berdasarkan tag div/br, kemudian bersihkan
          features: cleanHtmlAndSplit(
            apiResponse.feature?.features || "",
            "</div>|\\<br\\>"
          ),
          marqueeBgColor: apiResponse.feature?.marquebgcolor,
          marqueeTextColor: apiResponse.feature?.marquetextcolor,
          productSectionTitle: `Varian Produk ${apiResponse.brand}`,
          accentTextColor: apiResponse.testimonial?.textcolor || "#193cb8",

          productSidebar: {
            headline:
              apiResponse.productsidebar?.headline ||
              "Lihat varian produk unggulan.",
            // Hapus semua tag HTML dan spasi berlebihan
            description:
              apiResponse.productsidebar?.description
                .replace(/<\/?(div|p|ul|li|strong)[^>]*>/g, "")
                .trim() || "Deskripsi singkat sidebar produk.",
            ctaText:
              apiResponse.productsidebar?.ctatext || "Lihat semua varian",
            ctaURL: apiResponse.productsidebar?.ctalink || "/products",
          },

          // Pembuatan data produk dari API variants
          products: apiResponse.variants.map((variant, index) => ({
            name: variant.variant,
            imageURL: getImageUrl(variant.image),
            badge: index === 0 ? "Best Seller" : undefined,
            type: "Susu Bubuk",
            priceFrom: `Cek Harga`, // Placeholder
            reviews: `1K reviews`, // Placeholder
            linkText: "Beli Sekarang",
            linkURL: `/${slug}/product/${variant.id}`,
            isGoataProduct: true,
          })),

          aboutSection: {
            title: apiResponse.about?.title || `Tentang ${apiResponse.brand}`,
            description:
              apiResponse.about?.description
                .replace(/<\/?(div|p)[^>]*>/g, "")
                .trim() || "Deskripsi tentang brand dari API.",
            ctaText: apiResponse.about?.ctatext || "Pelajari lebih lanjut",
            ctaURL: apiResponse.about?.ctalink || "/about",
            imageURL: getImageUrl(apiResponse.about?.image),
          },
          howItWorks: {
            tagline: apiResponse.howitwork?.tagline || "Cara Kerjanya",
            // Pisahkan headline berdasarkan <br>
            headline: cleanHtmlAndSplit(
              apiResponse.howitwork?.headline || "",
              "<br>"
            ),
            // Pisahkan steps berdasarkan <br>
            steps: cleanHtmlAndSplit(
              apiResponse.howitwork?.steps || "",
              "<br>"
            ),
            ctaText: apiResponse.howitwork?.ctatext || "Kenali manfaat",
            ctaURL: apiResponse.howitwork?.ctalink || "/how-it-works",
            imageURL: getImageUrl(apiResponse.howitwork?.image),
          },
        };

        setData(mappedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data brand. Pastikan slug benar dan API aktif.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  // --- Render Kondisional ---

  if (loading) {
    return (
      <div
        className={`text-center py-20 text-xl ${sectionPaddingClass}`}
        style={{ backgroundColor: "white" }}
      >
        Memuat data untuk slug: **{slug}**... ⏳
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className={`text-center py-20 text-xl text-red-600 ${sectionPaddingClass}`}
        style={{ backgroundColor: "white" }}
      >
        ⚠️ Terjadi kesalahan: **{error || "Data brand tidak tersedia."}**
      </div>
    );
  }

  // Gunakan data yang sudah ter-map
  const currentData = data;

  // Helper untuk menampilkan satu fitur (Running Text)
  const FeatureItem: React.FC<{ feature: string; isLast: boolean }> = ({
    feature,
    isLast,
  }) => (
    <div className="flex items-center text-sm md:text-base px-6 md:px-8 py-3">
      <span className="mr-2 text-xl">✅</span>
      <span className="whitespace-nowrap font-medium">{feature}</span>
      {!isLast && (
        <span className="ml-3 h-4 w-px bg-white opacity-50 hidden md:block"></span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      <style>{`
        .embla { overflow: hidden; }
        .embla__container { display: flex; }
      `}</style>
      {/* 1. Hero Section (Data dinamis dari API) */}
      <section
        className={`relative pt-10 pb-20 ${sectionPaddingClass}`}
        style={{
          backgroundImage: `url('${currentData.hero.heroImageURL}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "80vh",
        }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
        <div className="relative max-w-4xl mx-auto text-center py-16">
          <h1 className="text-4xl md:text-5xl text-gray-900 mb-4">
            {currentData.hero.title}
          </h1>
          <p className="text-xl text-gray-700 mb-10">
            {currentData.hero.subtitle}
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href={currentData.hero.ctaShopURL}
              className="flex items-center justify-center px-6 py-3 border border-gray-900 text-sm font-medium rounded-full shadow-sm text-gray-900 bg-white hover:bg-gray-100 transition duration-300"
            >
              {currentData.hero.ctaShop}
              <span className="ml-2">→</span>
            </Link>
            <Link
              href={currentData.hero.ctaSubscribeURL}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition duration-300"
            >
              {currentData.hero.ctaSubscribe}
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Testimonial & Reviews Section (Data dinamis dari API) */}
      <section className={`py-20 ${sectionPaddingClass} bg-white`}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-3/5 mb-8 md:mb-0 md:pr-10">
            <blockquote className="text-xl md:text-2xl font-light leading-relaxed text-gray-700">
              <p>"{currentData.testimonial.quote}"</p>
            </blockquote>
          </div>
          <div
            className="md:w-2/5 text-white p-6 rounded-lg shadow-xl text-center md:text-left"
            style={{ backgroundColor: currentData.reviews.reviewBgColor }}
          >
            <p className="text-xl md:text-2xl font-extrabold mb-1">
              {currentData.reviews.count}
            </p>
            <p className="text-base md:text-xl font-light mb-2">
              {currentData.reviews.text}
            </p>
            <FiveStars />
            <Link
              href={currentData.reviews.linkURL}
              className="text-sm underline mt-3 inline-block hover:text-blue-200 transition duration-300"
            >
              {currentData.reviews.linkText}
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Features Bar - RUNNING TEXT (Data dinamis dari API) */}
      <section
        className="overflow-hidden border-t border-b"
        style={{
          backgroundColor: currentData.marqueeBgColor || "#F1F1F1",
          color: currentData.marqueeTextColor || "#0a0a0a",
        }}
      >
        <Marquee speed={30} gradient={false} pauseOnHover={true}>
          {currentData.features.map((feature, index) => (
            <FeatureItem
              key={`${feature}-${index}`}
              feature={feature}
              isLast={index === currentData.features.length - 1}
            />
          ))}
        </Marquee>
      </section>

      {/* 5. Product Slider Section (Data dinamis dari API) */}
      <section className="py-16 bg-white">
        <div className={`max-w-7xl mx-auto ${sectionPaddingClass}`}>
          <h2
            className="text-3xl md:text-4xl font-semibold text-center mb-12"
            style={{
              color: currentData.accentTextColor || "#0a0a0a",
            }}
          >
            {currentData.productSectionTitle}
          </h2>
          <div className="flex flex-col lg:flex-row items-start">
            {/* Kolom Kiri: Deskripsi & CTA (Disesuaikan dengan data API) */}
            <div className="w-full lg:w-1/3 min-w-[300px] bg-blue-50 rounded-lg p-8 lg:mr-8 mb-8 lg:mb-0 h-full">
              <h3 className="text-2xl font-semibold text-blue-900 mb-6">
                {currentData.productSidebar.headline}
              </h3>
              <p className="text-gray-700 mb-10">
                {currentData.productSidebar.description}
              </p>
              <Link
                href={currentData.productSidebar.ctaURL}
                className="flex items-center justify-center px-6 py-3 border border-blue-900 text-sm font-medium rounded-full shadow-sm text-blue-900 bg-white hover:bg-blue-100 transition duration-300"
              >
                {currentData.productSidebar.ctaText}{" "}
                <span className="ml-2">→</span>
              </Link>
            </div>

            {/* Kolom Kanan: Embla Slider (Data dinamis dari API) */}
            <div className="embla w-full lg:w-2/3" ref={emblaRef}>
              <div className="embla__container">
                {currentData.products.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. More About Us Section (Data dinamis dari API) */}
      <section
        className={`py-20 ${sectionPaddingClass} bg-gray-50 border-t border-gray-100`}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          {/* Kiri: Gambar Produk Berjejer */}
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10 flex justify-center">
            <img
              src={currentData.aboutSection.imageURL}
              alt={`Image for ${currentData.hero.title}`}
              className="w-full max-w-lg rounded-lg shadow-xl object-cover h-auto"
            />
          </div>

          {/* Kanan: Teks dan CTA */}
          <div className="lg:w-1/2 lg:pl-10">
            <h2
              className="text-3xl md:text-4xl font-semibold mb-6"
              style={{
                color: currentData.accentTextColor || "#0a0a0a",
              }}
            >
              {currentData.aboutSection.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {currentData.aboutSection.description}
            </p>
            <Link
              href={currentData.aboutSection.ctaURL}
              className="flex items-center px-6 py-3 border border-gray-900 text-sm font-medium rounded-full shadow-sm text-gray-900 bg-white hover:bg-gray-100 transition duration-300"
            >
              {currentData.aboutSection.ctaText}
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. How Our Products Work Section (Data dinamis dari API) */}
      <section
        className={`py-20 ${sectionPaddingClass} bg-white overflow-hidden`}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          {/* Kiri: Teks dan Langkah-langkah */}
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-2">
              {currentData.howItWorks.tagline}
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold mb-8 leading-tight"
              style={{
                color: currentData.accentTextColor || "#0a0a0a",
              }}
            >
              {currentData.howItWorks.headline.map((line, index) => (
                <React.Fragment key={index}>
                  <span
                    style={{
                      color:
                        index === 0
                          ? currentData.accentTextColor || "#0a0a0a"
                          : (currentData.accentTextColor || "#0a0a0a") + "A0",
                    }}
                  >
                    {line}
                  </span>
                  <br />
                </React.Fragment>
              ))}
            </h2>

            <div className="space-y-6 mb-8">
              {currentData.howItWorks.steps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <span className="flex items-center justify-center w-10 h-10 mr-4 text-gray-700 bg-white border border-gray-300 rounded-full font-bold text-sm shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-lg text-gray-700 ">{step}</p>
                </div>
              ))}
            </div>

            <Link
              href={currentData.howItWorks.ctaURL}
              className="flex items-center px-6 py-3 border border-gray-900 text-sm font-medium rounded-full shadow-sm text-gray-900 bg-white hover:bg-gray-100 transition duration-300"
            >
              {currentData.howItWorks.ctaText}
              <span className="ml-2">→</span>
            </Link>
          </div>

          {/* Kanan: Gambar Produk */}
          <div className="lg:w-1/2 flex justify-center lg:justify-start relative">
            <div
              className="absolute top-0 bottom-0 left-1/4 lg:left-0 w-3/4 lg:w-full bg-blue-50 rounded-l-3xl rounded-r-none lg:rounded-r-3xl"
              style={{
                height: "100%",
                transform: "translateX(-25%)",
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 25% 100%)",
                borderRadius: "0 80px 80px 0",
              }}
            ></div>
            <img
              src={currentData.howItWorks.imageURL}
              alt="Product in use with drinks"
              className="relative z-10 w-full max-w-md md:max-w-lg lg:max-w-none rounded-lg shadow-xl object-cover h-auto"
              style={{
                maxWidth: "600px",
                marginRight: "-10%",
                marginTop: "10%",
                marginBottom: "10%",
                transform: "scale(1.1)",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandProfile;
