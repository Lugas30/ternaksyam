import React from "react";

export default function Hero() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
          className="max-w-sm rounded-lg shadow-2xl"
        />
        <div>
          <h1 className="text-5xl font-bold">Etawa Goat Milk</h1>
          <h2 className="text-4xl font-bold">Kekuatan disetiap tetes</h2>
          <p className="py-6">
            Susu kambing Etawa bernutrisi tinggi dengan rasa lezat, rendah gula,
            dan tanpa aroma prengus. Baik untuk membantu pemulihan asma dan
            radang sendi serta aman dan disukai anak-anak!
          </p>
          <button className="btn btn-primary">Selengkapnya</button>
        </div>
      </div>
    </div>
  );
}
