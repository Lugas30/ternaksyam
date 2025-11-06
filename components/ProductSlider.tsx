import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

// Hapus atau abaikan import products.ts (data dummy)

// Definisi tipe untuk produk dari API
type ApiProduct = {
  id: number;
  brand: string; // Akan digunakan sebagai title (atau subtitle)
  variant: string; // Akan digunakan sebagai title (atau subtitle)
  image: string; // Akan digunakan sebagai img
  description: string; // Akan digunakan sebagai desc
  // Anda dapat menambahkan properti lain dari respons API jika diperlukan
};

// Tipe untuk respon API secara keseluruhan
type ApiResponse = {
  data: ApiProduct[];
};

// Konstanta API
const API_URL = "https://ts.crx.my.id/api/variant-all-brand"; // Ganti dengan API_URL dari env jika sudah di setup
// const API_IMAGE_URL = process.env.NEXT_PUBLIC_API_IMAGE_URL; // Tidak diperlukan karena URL gambar sudah lengkap

export default function ProductSliderEmbla() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetching Data dari API ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Menggunakan API_URL secara langsung dari konstanta
        const response = await axios.get<ApiResponse>(API_URL);
        setProducts(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Gagal mengambil data produk:", err);
        setError("Gagal memuat produk. Silakan coba lagi nanti.");
        setProducts([]); // Kosongkan produk jika gagal
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- Konfigurasi Embla Carousel (Tetap Sama) ---
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: false,
      align: "start",
      skipSnaps: true,
      dragFree: true,
      containScroll: "trimSnaps",
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
    // Cleanup function untuk menghapus listener saat komponen dilepas
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect, products.length]); // Tambahkan products.length sebagai dependency agar dots terupdate

  const scrollTo = (i: number) => emblaApi && emblaApi.scrollTo(i);
  // Navigasi prev/next dihilangkan karena di-comment di JSX

  // --- Tampilan Render ---
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl text-center font-bold text-emerald-900 mb-6">
          Category produk
        </h2>

        {isLoading && (
          <p className="text-center text-slate-600">Memuat produk...</p>
        )}
        {error && (
          <p className="text-center text-red-600 font-medium">Error: {error}</p>
        )}

        {!isLoading && products.length === 0 && !error && (
          <p className="text-center text-slate-600">
            Tidak ada produk ditemukan.
          </p>
        )}

        {!isLoading && products.length > 0 && (
          <div className="relative">
            {/* Tombol navigasi di-commented out */}

            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 p-2">
                {/* Mapping ke data API: products */}
                {products.map((p: ApiProduct, i: number) => (
                  <article
                    key={p.id}
                    className="shrink-0 w-[50%] sm:w-[30%] md:w-[25%] lg:w-[20%] xl:w-[18%] bg-white rounded-2xl shadow-md border border-slate-100 transition-transform duration-300 data-[active=true]:scale-[1.02]"
                    data-active={i === selectedIndex}
                  >
                    <div className="">
                      <div className="flex items-center justify-center">
                        <img
                          src={p.image}
                          alt={`${p.brand} ${p.variant}`}
                          className="h-full p-5 object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6">
                        {/* Menampilkan Brand sebagai judul */}
                        {/* <h3 className=" text-emerald-900 font-bold leading-tight">
                          {p.brand}
                        </h3> */}
                        {/* Menampilkan Variant sebagai sub-judul */}
                        <p className="text-emerald-900 font-semibold mt-1">
                          {p.variant}
                        </p>
                        {/* Menampilkan Deskripsi */}
                        {/* Hati-hati dengan XSS, tapi ini perlu karena deskripsi dari API berformat HTML */}
                        <div
                          className="mt-3 text-sm text-slate-600 line-clamp-3"
                          dangerouslySetInnerHTML={{
                            __html:
                              p.description?.replace(/<\/?div>/g, "") || // HANYA panggil replace JIKA p.description BUKAN null/undefined
                              "Tidak ada deskripsi.",
                          }}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="mt-6 flex justify-center gap-2">
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    selectedIndex === i ? "w-6 bg-emerald-900" : "bg-slate-300"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            {/* CTA */}
            <div className="flex justify-center mt-6">
              <Link href="/varian">
                <button className="btn btn-primary hover:bg-secondary border-none transition px-8 py-6 font-bold text-base rounded-full">
                  Lihat Semua Produk
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
