// ProductSliderEmbla.tsx
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";

// Data dummy produk
// products.ts
export const products = [
  {
    id: 1,
    title: "SyamsFarm Etawa Goat Milk",
    subtitle: "Goat Milk Powder",
    desc: "Produk susu kambing Etawa terbaik untuk kesehatan, kaya nutrisi dan mudah dicerna.",
    img: "https://placehold.co/500",
  },
  {
    id: 2,
    title: "Goat Me Non Sugar",
    subtitle: "Sugar-Free Goat Milk",
    desc: "Susu kambing tanpa gula, cocok untuk diet atau penderita diabetes.",
    img: "https://placehold.co/500",
  },
  {
    id: 3,
    title: "Milk Fat Faster",
    subtitle: "High Calorie Goat Milk",
    desc: "Susu penambah berat badan dengan kandungan lemak tinggi untuk pertumbuhan tubuh lebih cepat.",
    img: "https://placehold.co/500",
  },
  {
    id: 4,
    title: "Etawa Kolostrum",
    subtitle: "Etawa Colostrum",
    desc: "Susu kolostrum untuk mempercepat pemulihan daya tahan tubuh dan asam lambung.",
    img: "https://placehold.co/500",
  },
  {
    id: 5,
    title: "Etawa Powder",
    subtitle: "Etawa Milk Powder",
    desc: "Susu kambing Etawa dalam bentuk bubuk untuk konsumsi harian dengan kemasan praktis.",
    img: "https://placehold.co/500",
  },
  {
    id: 6,
    title: "Premium Cow Milk",
    subtitle: "Premium Cow Milk",
    desc: "Susu sapi premium, kaya protein dan kalsium, ideal untuk kesehatan tulang dan gigi.",
    img: "https://placehold.co/500",
  },
  {
    id: 7,
    title: "Soy Milk",
    subtitle: "Plant-Based Milk",
    desc: "Susu kedelai, pilihan susu nabati yang cocok untuk diet vegan atau intoleransi laktosa.",
    img: "https://placehold.co/500",
  },
  {
    id: 8,
    title: "Almond Milk",
    subtitle: "Almond-Based Milk",
    desc: "Susu almond, pilihan susu non-dairy yang ringan dan penuh manfaat bagi kesehatan jantung.",
    img: "https://placehold.co/500",
  },
];

// Definisi tipe untuk produk
type Product = {
  id: number;
  title: string;
  subtitle?: string;
  desc: string;
  img: string;
};

export default function ProductSliderEmbla() {
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
  }, [emblaApi, onSelect]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();
  const scrollTo = (i: number) => emblaApi && emblaApi.scrollTo(i);

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl text-center font-bold text-emerald-900 mb-6">
          Category produk
        </h2>

        <div className="relative">
          {/* <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg bg-white/90 backdrop-blur px-3 py-2 hover:bg-white"
            aria-label="Sebelumnya"
          >
            ‹
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-lg bg-white/90 backdrop-blur px-3 py-2 hover:bg-white"
            aria-label="Berikutnya"
          >
            ›
          </button> */}

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 p-2">
              {products.map((p: Product, i: number) => (
                <article
                  key={p.id}
                  className="shrink-0 w-[50%] sm:w-[30%] md:w-[25%] lg:w-[20%] xl:w-[18%] bg-white rounded-2xl shadow-md border border-slate-100 transition-transform duration-300 data-[active=true]:scale-[1.02]"
                  data-active={i === selectedIndex}
                >
                  <div className="">
                    <div className="flex items-center justify-center">
                      <img
                        src={p.img}
                        alt={p.title}
                        className="h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className=" text-emerald-900 font-semibold leading-tight">
                        {p.title}
                      </h3>
                      {/* {p.subtitle && (
                      <p className="text-emerald-900 font-semibold">
                        {p.subtitle}
                      </p>
                    )} */}
                      <p className="mt-3 text-sm text-slate-600">{p.desc}</p>
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
            <button className="btn btn-primary hover:bg-secondary border-none transition px-8 py-6 font-bold text-base rounded-full">
              Lihat Semua Produk
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
