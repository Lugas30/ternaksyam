"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { login } from "@/redux/thunks/authThunk";
import { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi form
    if (!email || !password) {
      setError("Email dan Password tidak boleh kosong.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email tidak valid.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Mengirim permintaan login dengan menggunakan dispatch
      await dispatch(login({ email, password })).unwrap();
      setIsLoading(false);
      toast.success("Login berhasil!"); // Menampilkan toaster sukses
    } catch (err) {
      setIsLoading(false);
      // Menangani error dengan tepat
      if (err instanceof Error) {
        setError(err.message); // Mengambil pesan error jika err adalah instance dari Error
        toast.error("Login gagal! Periksa kembali email atau password."); // Menampilkan toaster gagal
      } else {
        setError("Login gagal! Periksa kembali email atau password.");
        toast.error("Login gagal! Periksa kembali email atau password.");
      }
    }
  };

  // login by google mail
  const handleGoogleLogin = async () => {
    try {
      // get api
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
      );

      // redirect to url
      window.location.href = response.data.url;
    } catch (err) {
      // Menangani error dengan tepat
      if (err instanceof Error) {
        setError(err.message); // Mengambil pesan error jika err adalah instance dari Error
      } else {
        setError("Login gagal! Periksa kembali email atau password.");
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8 flex justify-between">
        {/* Form Login */}
        <div className="w-1/2">
          <h2 className="text-3xl font-semibold text-center text-green-600 mb-4">
            Masuk Akun
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Masuk untuk menikmati pengalaman personal dan mengakses semua
            layanan kami.
          </p>

          <form onSubmit={handleSubmit}>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            {/* Input Email */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input input-bordered w-full"
              />
            </div>

            {/* Input Password */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="input input-bordered w-full"
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <Link href="/forgot-password" className="text-sm text-green-600">
                Lupa password? Klik disini
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-full"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>
          <div className="divider text-sm font-semibold">atau</div>
          {/* Google */}
          <button
            className="w-full py-3 bg-white text-gray-700 font-semibold rounded-full border border-gray-300 hover:bg-gray-100 transition duration-150 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md disabled:opacity-50"
            onClick={handleGoogleLogin} // Handler untuk redirect ke Google OAuth
          >
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            Login with Google
          </button>
        </div>

        {/* Kolom Pendaftaran */}
        <div className="w-1/2 pl-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Belum punya akun?
          </h3>
          <p className="text-gray-600 mb-6">
            Daftar untuk menikmati pengalaman personal dan mengakses semua
            layanan kami.
          </p>
          <Link href="/register" className="btn btn-outline btn-green w-full">
            Daftar Akun
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
