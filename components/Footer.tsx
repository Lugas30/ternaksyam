"use client";

import Image from "next/image";
import React from "react";
import LogoTs from "../public/images/logo_ternaksyams.png";
import LogoHalal from "../public/images/logo_halal.png";
import LogoBpom from "../public/images/BPOM.png";
import Splash from "../public/images/milksplash.png"; // Pastikan gambar ini adalah versi PNG/transparan
import whatsapp from "@/public/images/wa.png";
import ig from "@/public/images/ig.png";
import fb from "@/public/images/fb.png";
import yt from "@/public/images/yt.png";
import tt from "@/public/images/tt.png";

export default function Footer() {
  return (
    <>
      <footer
        className="text-white relative overflow-hidden" // Tambahkan relative dan overflow-hidden
        style={{
          background: "linear-gradient(to bottom, #19996B, #106144)",
        }}
      >
        {/* Latar Belakang Milk Splash di kanan bawah */}
        <div
          className="absolute right-0 -bottom-8 w-full h-full pointer-events-none"
          style={{
            backgroundImage: `url(${Splash.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain", // Sesuaikan agar terlihat seperti gambar
            backgroundPosition: "right bottom",
            maxWidth: "700px", // Sesuaikan agar splash tidak terlalu besar
            opacity: 0.9, // Sedikit transparansi agar teks terlihat
          }}
        />

        <div className="relative z-10 grid grid-cols-12 w-full gap-4 px-10 md:px-20 pt-10 pb-5">
          {/* Kolom 1: Logo, Deskripsi, dan Logo Halal/BPOM (Col Span 4) */}
          <aside className="flex flex-col col-span-12 md:col-span-4 gap-5">
            <Image
              src={LogoTs}
              alt="TernakSyams Logo"
              width={180}
              height={30}
              className="w-40 h-auto mb-2"
            />

            <p className="max-w-xs text-sm">
              Susu kambing Etawa bernutrisi tinggi dengan rasa lezat, rendah
              gula, dan tanpa aroma prengus.
            </p>
            <div className="flex gap-4">
              {/* Halal Logo */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center">
                <Image
                  src={LogoHalal}
                  alt="Halal Logo"
                  width={50}
                  height={50}
                  className="w-auto h-auto p-3"
                />
              </div>
              {/* BPOM Logo */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center">
                <Image
                  src={LogoBpom}
                  alt="BPOM Logo"
                  width={50}
                  height={50}
                  className="w-auto h-auto p-3"
                />
              </div>
            </div>
          </aside>

          {/* Kolom 2: INFORMASI (Col Span 2) */}
          <nav className="flex flex-col col-span-6 md:col-span-2 gap-2 mt-5 md:mt-0">
            <h6 className="font-bold text-lg mb-2 tracking-wide">INFORMASI</h6>
            <a className="link link-hover text-sm">Tentang kami</a>
            <a className="link link-hover text-sm">Manfaat susu kambing</a>
            <a className="link link-hover text-sm">Varian susu kambing</a>
            <a className="link link-hover text-sm">Artikel</a>
            <a className="link link-hover text-sm">Arsip</a>
          </nav>

          {/* Kolom 3: SUSU KAMBING (Col Span 2) */}
          <nav className="flex flex-col col-span-6 md:col-span-2 gap-2 mt-5 md:mt-0">
            <h6 className="font-bold text-lg mb-2 tracking-wide">
              SUSU KAMBING
            </h6>
            <a className="link link-hover text-sm">Etawa Original</a>
            <a className="link link-hover text-sm">Goat Fly</a>
            <a className="link link-hover text-sm">Goata</a>
            <a className="link link-hover text-sm">Goat Me Non Sugar</a>
          </nav>

          {/* Kolom 4: KONSULTASI GRATIS & Media Sosial (Col Span 4) */}
          <div className="flex flex-col col-span-12 md:col-span-4 gap-4 mt-5 md:mt-0">
            {/* Box Konsultasi Gratis */}
            <div
              className="bg-primary p-4 rounded-xl shadow-2xl flex flex-col items-center justify-center"
              style={{ backgroundColor: "#0C4C35", minWidth: "300px" }}
            >
              <div className="flex items-center gap-3 w-full">
                {/* Ikon WhatsApp */}
                <img
                  src={whatsapp.src}
                  alt="WhatsApp Icon"
                  className="w-10 h-10 md:w-12 md:h-12"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-wide text-yellow-300">
                    KONSULTASI GRATIS
                  </span>
                  <span className="text-2xl font-extrabold">
                    0857-3232-1515
                  </span>
                </div>
              </div>
            </div>

            {/* Ikon Media Sosial */}
            <div className="flex gap-3 justify-center md:justify-start">
              {/* Facebook */}
              <a
                href="#"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-xl"
              >
                <img src={fb.src} alt="Facebook Icon" />
              </a>
              {/* Instagram */}
              <a
                href="#"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-xl"
              >
                <img src={ig.src} alt="Instagram Icon" />
              </a>
              {/* Youtube */}
              <a
                href="#"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-xl"
              >
                <img src={yt.src} alt="YouTube Icon" />
              </a>
              {/* TikTok */}
              <a
                href="#"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-xl"
              >
                <img src={tt.src} alt="TikTok Icon" />
              </a>
            </div>
          </div>

          {/* Baris Hak Cipta di bawah */}
          <div className="col-span-12 w-full pt-5">
            <div className="border-t border-white border-opacity-30 pt-4">
              <p className="text-sm">
                TernakSyams © Copyright {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
