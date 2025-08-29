import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Suspense } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import Hero from "@/components/Hero";
import HookTop from "@/components/HookTop";
import WhyUs from "@/components/WhyUs";
import HookBottom from "@/components/HookBottom";

export default function Home() {
  return (
    <>
      <Navbar />
      <section>
        <Suspense fallback={<div>Loading...</div>}>
          <VideoPlayer />
        </Suspense>
      </section>
      <section>
        <Hero />
      </section>
      <section>
        <HookTop />
      </section>
      <section>
        <WhyUs />
      </section>
      <section>
        <HookBottom />
      </section>
      <Footer />
    </>
  );
}
