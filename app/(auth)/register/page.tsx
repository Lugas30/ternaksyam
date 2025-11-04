"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import erroricon from "@/public/images/error.svg";
import successicon from "@/public/images/success.svg";
import Image from "next/image";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>(""); // Pesan untuk modal
  const [modalType, setModalType] = useState<"success" | "error" | "">(""); // Jenis modal
  const modalRef = useRef<HTMLDialogElement | null>(null); // Referensi untuk modal DaisyUI

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi Form
    if (!name || !email || !whatsapp || !password) {
      setError("Semua kolom harus diisi.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email tidak valid.");
      return;
    }

    const whatsappRegex = /^[0-9]{10,13}$/;
    if (!whatsappRegex.test(whatsapp)) {
      setError("Nomor WhatsApp tidak valid.");
      return;
    }

    // Clear error and start loading
    setError("");
    setIsLoading(true);

    // API URL
    const apiUrl = "https://ts.crx.my.id/api/auth/register";

    // Data untuk dikirim
    const registerData = {
      name: name,
      email: email,
      nowhatsapp: whatsapp,
      password: password,
    };

    // Simulasi permintaan register
    try {
      const response = await axios.post(apiUrl, registerData);

      // Menangani response sukses
      if (response.data.message === "User created successfully") {
        setModalMessage("Pendaftaran berhasil!");
        setModalType("success"); // Tipe modal sukses
        modalRef.current?.showModal(); // Buka modal jika pendaftaran berhasil
        // Reset form setelah pendaftaran sukses
        setName("");
        setEmail("");
        setWhatsapp("");
        setPassword("");
      }
    } catch (error: any) {
      // Menangani error jika pendaftaran gagal
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;

        // Jika email sudah digunakan
        if (errorMessage === "The email has already been taken.") {
          setModalMessage(
            "Email sudah digunakan. Silakan coba dengan email lain."
          );
          setModalType("error"); // Tipe modal error
          modalRef.current?.showModal(); // Buka modal jika email sudah terdaftar
        } else {
          setModalMessage("Pendaftaran gagal. Silakan coba lagi.");
          setModalType("error"); // Tipe modal error
          modalRef.current?.showModal(); // Buka modal jika pendaftaran gagal
        }
      } else {
        setModalMessage("Terjadi kesalahan jaringan. Silakan coba lagi.");
        setModalType("error"); // Tipe modal error
        modalRef.current?.showModal(); // Buka modal jika terjadi kesalahan jaringan
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close(); // Menutup modal
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8 flex justify-between">
        {/* Form Register */}
        <div className="w-1/2">
          <h2 className="text-3xl font-semibold text-center text-green-600 mb-4">
            Daftar Akun
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Masuk untuk menikmati pengalaman personal dan mengakses semua
            layanan kami.
          </p>

          <form onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            {/* Input Nama */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold pb-1">Nama</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama"
                className="input validator input-bordered w-full"
                required
              />
              <p className="validator-hint">Nama harus diisi</p>
            </div>

            {/* Input Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold pb-1">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input validator w-full"
                required
              />
              <p className="validator-hint">Masukan email yang sesuai</p>
            </div>

            {/* Input No Whatsapp */}
            <div className="form-control">
              <label className="label">
                <span className="label-text label-text font-bold pb-1">
                  No Whatsapp
                </span>
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="input validator tabular-nums w-full"
                required
                placeholder="Phone"
                pattern="[0-9]*"
                minLength={10}
                maxLength={14}
                title="Must be 10 digits"
              />
              <p className="validator-hint">Minimal 10 digit angka</p>
            </div>

            {/* Input Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text label-text font-bold pb-1">
                  Password
                </span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="input validator input-bordered w-full"
                required
                minLength={4}
              />
              <p className="validator-hint">Harus lebih dari 4 karakter</p>
            </div>

            <div className="flex justify-between items-center mb-6">
              <a href="#" className="text-sm text-green-600">
                Lupa password? Klik disini
              </a>
              <div>
                <span className="text-sm">Sudah punya akun?</span>
                <Link
                  href="/login"
                  className="text-sm text-green-600 font-semibold"
                >
                  {" "}
                  Masuk Akun
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-green w-full"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Daftar"}
            </button>
          </form>
        </div>

        {/* Kolom Pendaftaran */}
        <div className="w-1/2 pl-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Keuntungan menjadi member
          </h3>
          <p className="text-gray-600 mb-6">
            Masuk untuk menikmati pengalaman personal dan mengakses semua
            layanan kami.
          </p>
          <a href="/login" className="btn btn-outline btn-green w-full">
            Masuk Akun
          </a>
        </div>
      </div>

      {/* Modal DaisyUI for Success */}
      <dialog id="my_modal_3" className="modal" ref={modalRef}>
        <div className="modal-box flex flex-col items-center justify-center p-10 space-y-2">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={closeModal}
          >
            ✕
          </button>

          {/* Success modal content */}
          {modalType === "success" && (
            <>
              <Image src={successicon} alt="success" width={200} height={200} />
              <h3 className="font-bold text-2xl text-center mt-4">
                {/* {modalMessage} */}
                Pendaftaran Sukses
              </h3>
              <p>Silakan login untuk melanjutkan ke akun Anda.</p>
            </>
          )}

          {/* Error modal content */}
          {modalType === "error" && (
            <>
              <Image src={erroricon} alt="error" width={100} height={100} />
              <h3 className="font-bold text-lg text-center mt-4">
                {modalMessage}
              </h3>
            </>
          )}

          <div className="mt-4 flex justify-center w-full">
            <button
              className="btn btn-primary font-bold px-20 py-4 rounded-md"
              onClick={closeModal}
            >
              OK
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Register;
