import React from "react";

// -------------------------------------------
// 1. DEFINISI TIPE DATA (TYPES)
// -------------------------------------------

interface Variant {
  id: number;
  name: string;
  image: string; // Path atau URL gambar varian
}

interface Product {
  id: number;
  name: string;
  slug: string; // Field slug untuk link
  description: string;
  mainImage: string;
  availableSizes: string[];
  variants: Variant[];
}

// -------------------------------------------
// 2. FUNGSI UTILITY (untuk membuat slug)
// -------------------------------------------

/**
 * Mengubah string menjadi slug yang ramah URL (misalnya: "Goat Milk Almond" -> "goat-milk-almond")
 */
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Ganti spasi dengan tanda hubung
    .replace(/[^\w-]+/g, ""); // Hapus karakter non-alfanumerik
};

// -------------------------------------------
// 3. DATA DUMMY
// -------------------------------------------

const DUMMY_IMAGE = "https://placehold.co/800x800.png";
const DUMMY_VARIANT_IMAGE_BASE = "https://placehold.co/600x600.png";

// Data dummy kini menggunakan fungsi createSlug untuk membuat slug secara otomatis
const productsData: Product[] = [
  {
    id: 1,
    name: "Goata",
    slug: createSlug("Goata"), // etawa-goat-milk-almond
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    mainImage: DUMMY_IMAGE,
    availableSizes: ["250 Gram", "500 Gram", "1000 Gram"],
    variants: [
      {
        id: 101,
        name: "Original",
        image: DUMMY_VARIANT_IMAGE_BASE,
      },
      {
        id: 102,
        name: "Cokelat",
        image: DUMMY_VARIANT_IMAGE_BASE,
      },
      {
        id: 103,
        name: "Stroberi",
        image: DUMMY_VARIANT_IMAGE_BASE,
      },
    ],
  },
  {
    id: 2,
    name: "Goatlyf",
    slug: createSlug("Goatlyf"), // goat-me-non-sugar
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    mainImage: DUMMY_IMAGE,
    availableSizes: ["250 Gram", "500 Gram", "1000 Gram"],
    variants: [
      {
        id: 201,
        name: "Plain",
        image: DUMMY_VARIANT_IMAGE_BASE,
      },
      {
        id: 202,
        name: "Vanilla",
        image: DUMMY_VARIANT_IMAGE_BASE,
      },
    ],
  },
];

// -------------------------------------------
// 4. KOMPONEN UTAMA (ProductPage)
// -------------------------------------------

const ProductPage: React.FC = () => {
  /**
   * Sub-Komponen untuk Thumbnail Varian Rasa
   */
  const VariantThumbnail: React.FC<{ variant: Variant }> = ({ variant }) => (
    // Mengubah w-20 h-auto menjadi w-16 h-auto pada mobile, dan w-20 h-auto pada md
    <div className="flex flex-col items-center p-1">
      <div className="w-16 md:w-20 h-auto bg-white border border-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-200 cursor-pointer">
        <img
          src={variant.image}
          alt={`Varian ${variant.name}`}
          className="object-contain w-full h-full"
        />
      </div>
    </div>
  );

  /**
   * Sub-Komponen untuk setiap Blok Produk
   */
  const ProductBlock: React.FC<{ product: Product }> = ({ product }) => {
    // Link tujuan menggunakan slug
    const productUrl = `/product/${product.slug}`;

    return (
      <div className="py-8 md:py-10">
        {/* 1. Detail Utama Produk */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Gambar Utama */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            {/* Mengatur agar gambar lebih kecil di mobile */}
            <div className="w-4/5 sm:w-2/3 md:w-full h-auto shadow-xl">
              <img
                src={product.mainImage}
                alt={`Produk ${product.name}`}
                className="object-contain w-full h-full"
              />
            </div>
          </div>

          {/* Deskripsi & Ukuran */}
          <div className="w-full md:w-2/3">
            {/* **Penyesuaian Font Size:** text-2xl/3xl pada mobile, text-4xl pada desktop */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3 md:mb-4 leading-tight">
              {product.name}
            </h2>

            {/* Deskripsi */}
            {/* **Penyesuaian Font Size:** text-sm/base pada mobile, text-base/lg pada desktop */}
            <p className="text-sm sm:text-base text-gray-600 mb-4 md:mb-6 text-justify leading-relaxed">
              {product.description}
            </p>

            {/* Ukuran */}
            {/* **Penyesuaian Font Size:** text-base pada mobile, text-lg pada desktop */}
            <p className="font-bold text-base md:text-lg text-gray-700 mt-3 md:mt-4 mb-1 md:mb-2">
              Tersedia dalam ukuran :
            </p>
            <ul className="list-none space-y-1 text-gray-600">
              {/* **Penyesuaian Font Size:** text-sm pada mobile, text-base pada desktop */}
              {product.availableSizes.map((size, index) => (
                <li key={index} className="text-sm md:text-base font-medium">
                  {size}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 2. Bagian Varian Rasa */}
        <div className="mt-8 md:mt-12">
          {/* **Penyesuaian Font Size:** text-xl pada mobile, text-2xl pada desktop */}
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 border-b border-gray-200 pb-2">
            Varian rasa
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
            <a
              href={productUrl} // Menggunakan slug produk
              className="inline-block px-6 py-2 md:px-8 md:py-3 bg-green-600 text-white font-semibold text-base md:text-lg rounded-full shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 no-underline text-center"
            >
              Selengkapnya
            </a>
          </div>
        </div>
        {/* Divider antar produk, kecuali produk terakhir */}
        {productsData.indexOf(product) < productsData.length - 1 && (
          <hr className="my-8 md:my-10 border-t border-gray-200" />
        )}
      </div>
    );
  };

  // Render utama komponen ProductPage
  return (
    // **Penyesuaian Padding Halaman:** p-4 pada mobile, sm:p-12 pada desktop
    <div className="min-h-screen p-4 sm:p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header Halaman */}
        <header className="mb-8 md:mb-12">
          {/* **Penyesuaian Font Size:** text-4xl pada mobile, text-5xl pada desktop */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-green-700 tracking-tight">
            Produk Kami
          </h1>
        </header>

        {/* Konten Produk Utama (Looping data) */}
        <main>
          {productsData.map((product) => (
            <ProductBlock key={product.id} product={product} />
          ))}
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
