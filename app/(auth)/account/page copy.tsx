"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/slices/authSlice";
import { fetchUser } from "@/redux/thunks/userThunk";

const AccountPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    // Skenario aman:
    // 1) Jika tidak ada token sama sekali => paksa ke /login
    // 2) Jika ada token tapi user belum ada => fetchUser
    // 3) Jika ada token dan user sudah ada => tidak perlu fetch lagi (opsional)
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, router, user]);

  const handleLogout = () => {
    dispatch(logout());
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("email");
    } catch {}
    router.push("/");
  };

  // Jika belum ada token, jangan render apapun
  if (typeof window !== "undefined" && !localStorage.getItem("token")) {
    return null;
  }

  // Sambil menunggu user terisi, kamu bisa tampilkan loader sederhana
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Akun Saya</h1>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          Memuat data akun...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Akun Saya</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div>
          <div className="text-sm text-gray-500">ID</div>
          <div className="font-medium">{user.id}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Nama</div>
          <div className="font-medium">{user.name}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Email</div>
          <div className="font-medium">{user.email}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Role</div>
          <div className="font-medium">{user.role}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Email Verified</div>
          <div className="font-medium">
            {user.email_verified_at ?? "Belum diverifikasi"}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Google ID</div>
          <div className="font-medium">{user.google_id ?? "-"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Created At</div>
          <div className="font-medium">{user.created_at}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Updated At</div>
          <div className="font-medium">{user.updated_at}</div>
        </div>

        <div className="pt-4">
          <button onClick={handleLogout} className="btn btn-error text-white">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
