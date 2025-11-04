"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Marquee from "react-fast-marquee";

// --- Tipe Data (Diperbarui) ---
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

  // --- Properti Baru (Diperbarui) ---
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
    // --- Penambahan properti linkURL untuk ctaText ---
    ctaURL: string;
    imageURL: string;
  };
  howItWorks: {
    tagline: string;
    headline: string[];
    steps: string[];
    ctaText: string;
    // --- Penambahan properti linkURL untuk ctaText ---
    ctaURL: string;
    imageURL: string;
  };
}

// --- Data Dummy (FINAL dengan semua data di dalam objek) ---
const dummyData: BrandData = {
  hero: {
    title: "Pulih lebih cepat, bergerak lebih bebas",
    subtitle:
      "Goata hadir untuk bantu pemulihan dari dalam, dengan kebaikan susu kambing alami.",
    ctaShop: "coba sekarang",
    ctaShopURL: "/shop",
    ctaSubscribe: "lihat manfaatnya",
    ctaSubscribeURL: "/benefits",
    heroImageURL:
      "https://images.unsplash.com/photo-1704369291921-a1abffc09768?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870",
    imageAlt:
      "Minuman sehat di pagi hari dengan buah-buahan dan latar belakang cerah",
  },
  testimonial: {
    quote:
      "Goata bantu pemulihan secara menyeluruh, bukan sekadar meredakan. Mulai dari masalah pernapasan, persendian, pencernaan, daya tahan tubuh, dan lebih dari itu.",
  },
  reviews: {
    count: "150.000+ keluarga telah memilih Goata",
    text: "Five Star Reviews",
    linkText: "read the reviews",
    linkURL: "/reviews",
    reviewBgColor: "#193cb8",
  },

  features: [
    "Kandungan susu 70%",
    "Tidak berbau prengus",
    "Rasa yang ringan & nyaman dikonsumsi",
    "Tanpa bahan pengawet",
    "Lebih bernutrisi",
    "Harga terjangkau",
  ],
  marqueeBgColor: "#193cb8",
  marqueeTextColor: "#ededed",

  accentTextColor: "#193cb8",
  productSectionTitle: "Varian Produk Goata",

  productSidebar: {
    headline:
      "Formulasi alami susu kambing, dirancang untuk bantu pemulihandari dalam.",
    description:
      "Formulasi Goata yang kaya nutrisi susu kambing murni membantu pemulihan dan menjaga daya tahan tubuh Anda.",
    ctaText: "Lihat produk Goata",
    // --- Data linkURL ditambahkan ---
    ctaURL: "/products",
  },

  products: [
    {
      name: "Goata Original",
      imageURL: "https://placehold.co/800x800.png",
      badge: "Best Seller",
      type: "Susu Kambing Bubuk",
      priceFrom: "Dari Rp. 165.000",
      reviews: "1.2K reviews",
      linkText: "Beli Sekarang",
      linkURL: "/product/goata-original",
      isGoataProduct: true,
    },
    {
      name: "Goata Jahe",
      imageURL: "https://placehold.co/800x800.png",
      badge: "Best Seller",
      type: "Susu Bubuk + Jahe",
      priceFrom: "Dari Rp. 80.000",
      reviews: "950 reviews",
      linkText: "Beli Sekarang",
      linkURL: "/product/goata-jahe",
      isGoataProduct: true,
    },
    {
      name: "Goata Kurma Madu",
      imageURL: "https://placehold.co/800x800.png",
      badge: "",
      type: "Susu Bubuk + Kurma & Madu",
      priceFrom: "Dari Rp. 85.000",
      reviews: "800 reviews",
      linkText: "Beli Sekarang",
      linkURL: "/product/goata-kurma-madu",
      isGoataProduct: true,
    },
    {
      name: "Goata Cokelat",
      imageURL: "https://placehold.co/800x800.png",
      badge: "",
      type: "Susu Bubuk + Cokelat",
      priceFrom: "Dari Rp. 80.000",
      reviews: "600 reviews",
      linkText: "Beli Sekarang",
      linkURL: "/product/goata-cokelat",
      isGoataProduct: true,
    },
  ],

  aboutSection: {
    title: "Lebih dekat dengan Goata Tentang kami",
    description:
      "Kami percaya, tubuh pulih lebih baik dengan dukungan yang alami. Goata hadir dengan kebaikan susu kambing, formula yang teruji, dan komitmen pada kualitas.",
    ctaText: "Pelajari lebih lanjut",
    ctaURL: "/about",
    imageURL: "https://placehold.co/800x800.png",
  },

  howItWorks: {
    tagline: "Hasil nyata dari konsumsi rutin Goata",
    headline: [
      "Bernapas lebih lega",
      "Bergerak tanpa nyeri",
      "Tubuh lebih aktif",
      "Imun terjaga",
    ],
    steps: [
      "Rutin konsumsi Goata 2x sehari.",
      "Tetap aktif & istirahat cukup.",
      "Rasakan perubahannya.",
    ],
    ctaText: "Kenali manfaat Goata",
    ctaURL: "/how-it-works",
    imageURL: "https://placehold.co/800x800.png",
  },
};

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

// Komponen Produk Card (Diperbarui)
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
      // --- Menggunakan properti linkURL untuk href ---
      href={product.linkURL}
      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition duration-150"
    >
      {product.linkText} →
    </Link>
  </div>
);

// --- Komponen BrandProfile Utama ---
const BrandProfile: React.FC = () => {
  const data = dummyData;
  // 4. PENYESUAIAN DATA: Menghapus duplikasi manual karena Marquee menanganinya.
  // const doubledFeatures = [...data.features, ...data.features];
  const [emblaRef] = useEmblaCarousel(EMBLA_OPTIONS);

  // Helper untuk menampilkan satu fitur (Running Text)
  const FeatureItem: React.FC<{ feature: string; isLast: boolean }> = ({
    feature,
    isLast,
  }) => (
    // Menggunakan 'mr-0' dan 'md:mr-0' untuk mengontrol spasi horizontal.
    <div className="flex items-center text-sm md:text-base px-6 md:px-8 py-3">
      <span className="mr-2 text-xl">✅</span>
      <span className="whitespace-nowrap font-medium">{feature}</span>
      {/* 4. PENYESUAIAN TAMPILAN: Hanya tampilkan pemisah jika bukan elemen terakhir yang di-render */}
      {!isLast && (
        <span className="ml-3 h-4 w-px bg-white opacity-50 hidden md:block"></span>
      )}
    </div>
  );

  // Kelas padding responsif yang diminta
  const sectionPaddingClass = "px-4 md:px-6 lg:px-12";

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* 2. PENGHAPUSAN: Hapus keyframes CSS manual custom-marquee */}
      <style>{`
        .embla { overflow: hidden; }
        .embla__container { display: flex; }
      `}</style>

      {/* 1. Hero Section (Data dinamis) */}
      <section
        className={`relative pt-10 pb-20 ${sectionPaddingClass}`} // DIUBAH
        style={{
          backgroundImage: `url('${data.hero.heroImageURL}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "80vh",
        }}
      >
        {/* Actifkan untuk membuat efek blur */}
        {/* <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div> */}
        <div className="relative max-w-4xl mx-auto text-center py-16">
          <h1 className="text-4xl md:text-5xl text-gray-800 mb-4">
            {data.hero.title}
          </h1>
          <p className="text-xl text-gray-600 mb-10">{data.hero.subtitle}</p>
          <div className="flex justify-center space-x-4">
            {/* CTA 1 (Hero) - Menggunakan <a> untuk link */}
            <Link
              href={data.hero.ctaShopURL}
              className="flex items-center justify-center px-6 py-3 border border-gray-900 text-sm font-medium rounded-full shadow-sm text-gray-900 bg-white hover:bg-gray-100 transition duration-300"
            >
              {data.hero.ctaShop}
              <span className="ml-2">→</span>
            </Link>
            {/* CTA 2 (Hero) - Menggunakan <a> untuk link */}
            <Link
              href={data.hero.ctaSubscribeURL}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition duration-300"
            >
              {data.hero.ctaSubscribe}
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Testimonial & Reviews Section (Data dinamis) */}
      <section className={`py-20 ${sectionPaddingClass} bg-white`}>
        {" "}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-3/5 mb-8 md:mb-0 md:pr-10">
            <blockquote className="text-xl md:text-2xl font-light leading-relaxed text-gray-700">
              <p>"{data.testimonial.quote}"</p>
            </blockquote>
          </div>
          <div
            className="md:w-2/5 text-white p-6 rounded-lg shadow-xl text-center md:text-left"
            // 💡 INI ADALAH PERUBAHAN UTAMA: MENGGUNAKAN INLINE STYLE
            style={{ backgroundColor: data.reviews.reviewBgColor }}
          >
            <p className="text-xl md:text-2xl font-extrabold mb-1">
              {data.reviews.count}
            </p>
            <p className="text-base md:text-xl font-light mb-2">
              {data.reviews.text}
            </p>
            <FiveStars />
            <Link
              // Menggunakan properti linkURL untuk href
              href={data.reviews.linkURL}
              className="text-sm underline mt-3 inline-block hover:text-blue-200 transition duration-300"
            >
              {data.reviews.linkText}
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Logos Section (Data dinamis) */}

      {/* 4. Features Bar - RUNNING TEXT (Data dinamis) */}
      <section
        className="overflow-hidden border-t border-b"
        style={{
          backgroundColor: data.marqueeBgColor || "#F1F1F1",
          color: data.marqueeTextColor || "#0a0a0a",
        }}
      >
        {/* 3. PENGGANTIAN: Ganti div manual dengan komponen Marquee */}
        <Marquee
          speed={30} // Sesuaikan kecepatan (default 50)
          gradient={false} // Matikan gradient jika tidak diinginkan
          pauseOnHover={true} // Opsional: Berhenti saat di-hover
        >
          {data.features.map((feature, index) => (
            // Menggunakan index == data.features.length - 1 untuk properti isLast
            <FeatureItem
              key={`${feature}-${index}`}
              feature={feature}
              isLast={index === data.features.length - 1}
            />
          ))}
        </Marquee>
      </section>

      {/* 5. Product Slider Section (Data dinamis, termasuk Sidebar) */}
      {/* Catatan: Untuk Section ini, padding harus diterapkan di dalam karena elemen slider dan sidebar memiliki tata letak khusus */}
      <section className="py-16 bg-white">
        <div className={`max-w-7xl mx-auto ${sectionPaddingClass}`}>
          {" "}
          {/* Ditambahkan padding di dalam div untuk menjaga lebar max-w-7xl */}
          <h2
            className="text-3xl md:text-4xl font-semibold text-center mb-12"
            style={{
              color: data.accentTextColor || "#0a0a0a",
            }}
          >
            {data.productSectionTitle}
          </h2>
          <div className="flex flex-col lg:flex-row items-start">
            {/* Kolom Kiri: Deskripsi & CTA */}
            <div className="w-full lg:w-1/3 min-w-[300px] bg-blue-50 rounded-lg p-8 lg:mr-8 mb-8 lg:mb-0 h-full">
              <h3 className="text-2xl font-semibold text-blue-900 mb-6">
                {data.productSidebar.headline}
              </h3>
              <p className="text-gray-700 mb-10">
                {data.productSidebar.description}
              </p>
              {/* CTA Sidebar - Menggunakan <a> untuk link */}
              <button>
                <Link
                  href={data.productSidebar.ctaURL}
                  className="flex items-center justify-center px-6 py-3 border border-blue-900 text-sm font-medium rounded-full shadow-sm text-blue-900 bg-white hover:bg-blue-100 transition duration-300"
                >
                  {data.productSidebar.ctaText} <span className="ml-2">→</span>
                </Link>
              </button>
            </div>

            {/* Kolom Kanan: Embla Slider (Data dinamis) */}
            {/* Embla slider membutuhkan 'embla' dan 'embla__container' di luarnya */}
            <div className="embla w-full lg:w-2/3" ref={emblaRef}>
              <div className="embla__container">
                {data.products.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. More About Us Section (Data dinamis) */}
      <section
        className={`py-20 ${sectionPaddingClass} bg-gray-50 border-t border-gray-100`}
      >
        {" "}
        {/* DIUBAH */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          {/* Kiri: Gambar Produk Berjejer */}
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10 flex justify-center">
            <img
              src={data.aboutSection.imageURL}
              alt="Goata various flavors lined up"
              className="w-full max-w-lg rounded-lg shadow-xl object-cover h-auto"
            />
          </div>

          {/* Kanan: Teks dan CTA */}
          <div className="lg:w-1/2 lg:pl-10">
            <h2
              className="text-3xl md:text-4xl font-semibold mb-6"
              style={{
                color: data.accentTextColor || "#0a0a0a",
              }}
            >
              {data.aboutSection.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {data.aboutSection.description}
            </p>
            {/* CTA About - Menggunakan <a> untuk link */}
            <button>
              <Link
                href={data.aboutSection.ctaURL}
                className="flex items-center px-6 py-3 border border-gray-900 text-sm font-medium rounded-full shadow-sm text-gray-900 bg-white hover:bg-gray-100 transition duration-300"
              >
                {data.aboutSection.ctaText}
                <span className="ml-2">→</span>
              </Link>
            </button>
          </div>
        </div>
      </section>

      {/* 7. How Our Products Work Section (Data dinamis dan UI diperbaiki) */}
      <section
        className={`py-20 ${sectionPaddingClass} bg-white overflow-hidden`}
      >
        {" "}
        {/* DIUBAH */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          {/* Kiri: Teks dan Langkah-langkah */}
          <div className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-2">
              {data.howItWorks.tagline}
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold mb-8 leading-tight"
              style={{
                color: data.accentTextColor || "#0a0a0a", // Warna utama H2
              }}
            >
              {data.howItWorks.headline.map((line, index) => (
                <React.Fragment key={index}>
                  <span
                    // Hapus className warna
                    style={{
                      color:
                        index === 0
                          ? data.accentTextColor || "#0a0a0a" // Baris pertama (warna utama)
                          : (data.accentTextColor || "#0a0a0a") + "A0", // Baris berikutnya (warna sedikit lebih terang/transparan)
                    }}
                  >
                    {line}
                  </span>
                  <br />
                </React.Fragment>
              ))}
            </h2>

            <div className="space-y-6 mb-8">
              {data.howItWorks.steps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <span className="flex items-center justify-center w-10 h-10 mr-4 text-gray-700 bg-white border border-gray-300 rounded-full font-bold text-sm shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-lg text-gray-700 ">{step}</p>
                </div>
              ))}
            </div>

            {/* CTA How It Works - Menggunakan <a> untuk link */}
            <button>
              <Link
                href={data.howItWorks.ctaURL}
                className="flex items-center px-6 py-3 border border-gray-900 text-sm font-medium rounded-full shadow-sm text-gray-900 bg-white hover:bg-gray-100 transition duration-300"
              >
                {data.howItWorks.ctaText}
                <span className="ml-2">→</span>
              </Link>
            </button>
          </div>

          {/* Kanan: Gambar Produk (dengan latar belakang melengkung yang lebih akurat) */}
          <div className="lg:w-1/2 flex justify-center lg:justify-start relative">
            {/* Background biru muda melengkung */}
            {/* Penyesuaian padding luar tidak dilakukan di sini karena ini adalah elemen visual murni di sisi kanan. */}
            <div
              className="absolute top-0 bottom-0 left-1/4 lg:left-0 w-3/4 lg:w-full bg-blue-50 rounded-l-3xl rounded-r-none lg:rounded-r-3xl"
              style={{
                height: "100%",
                transform: "translateX(-25%)",
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 25% 100%)",
                borderRadius: "0 80px 80px 0",
              }}
            ></div>
            {/* Gambar produk yang 'melayang' */}
            <img
              src={data.howItWorks.imageURL}
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
