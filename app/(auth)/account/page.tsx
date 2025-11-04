"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "@/redux/thunks/authThunk";
import { RootState } from "@/redux/store";
import { logout, AuthUser } from "@/redux/slices/authSlice"; // 💡 Import AuthUser dari slice baru
import { useRouter } from "next/navigation";

import VoucherList from "@/components/VoucherList";
import OrderHistory from "@/components/OrderHistory";

// 💡 Definisikan interface Voucher dari Komponen Voucher
interface Voucher {
  id: number;
  user_id: number;
  voucher_id: number;
  title: string;
  thumbnail: string;
  content: string;
  created_at: string;
  updated_at: string;
  voucher: {
    id: number;
    code: string;
    type: "transaction" | "shipping";
    amount_type: "percent" | "value";
    amount: number;
    max_value: number | null;
    min_transaction_value: number;
    quota: number;
    limit: number;
    start_date: string;
    end_date: string;
    status: string;
  };
}

const TabButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left text-lg md:text-xl transition-colors select-none",
        "py-5 px-4 md:px-6 border-b border-gray-300",
        isActive
          ? "bg-[#0E5A45] text-white rounded-r-lg font-semibold"
          : "text-gray-900 hover:bg-gray-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
};

export default function AccountPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  // 🚨 PERUBAHAN 3: Ambil state dari state.auth, dan gunakan nama properti baru
  const { user, isUserLoading, userError } = useSelector(
    (state: RootState) => state.auth
  );

  const [active, setActive] = useState<
    "order" | "promo" | "voucher" | "profile"
  >("profile");

  useEffect(() => {
    // 🚨 PERUBAHAN 4: Panggil thunk yang baru
    dispatch(fetchUserData() as any);
  }, [dispatch]);

  const handleLogout = () => {
    // Disarankan untuk menghapus item localStorage yang berhubungan dengan session/auth
    // kecuali jika digunakan oleh mekanisme di luar Redux Persist.
    // Biasanya, memanggil dispatch(logout()) sudah cukup karena Redux Persist
    // akan menghapus token dan user dari localStorage.

    // Hapus baris ini jika Anda sepenuhnya mengandalkan Redux Persist
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("session");

    dispatch(logout());
    router.push("/login");
  };

  // Tampilkan UI Loading atau Error berdasarkan state auth yang baru
  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Data Akun...
      </div>
    );
  }

  if (userError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {userError}
      </div>
    );
  }

  // Tampilkan pesan jika user null dan tidak ada error/loading
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Silakan login untuk mengakses halaman ini.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-10 py-10 md:py-14">
        <div className="flex items-stretch gap-8 md:gap-10">
          {/* LEFT: Sidebar */}
          <aside className="w-[320px] md:w-[360px] lg:w-[400px] shrink-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-extrabold text-[#155E49]">
              {/* Gunakan user yang sudah dipastikan ada di atas */}
              Hi, {user.name}
            </h1>
            <p className="mt-3 text-gray-500">
              Manage your account setting and personal information.
            </p>

            <div className="mt-6 md:mt-8">
              <TabButton
                label="Order History"
                isActive={active === "order"}
                onClick={() => setActive("order")}
              />
              <TabButton
                label="Promo Info"
                isActive={active === "promo"}
                onClick={() => setActive("promo")}
              />
              <TabButton
                label="Voucher"
                isActive={active === "voucher"}
                onClick={() => setActive("voucher")}
              />
              <TabButton
                label="Profile"
                isActive={active === "profile"}
                onClick={() => setActive("profile")}
              />
            </div>

            <div className="pt-6 md:pt-8">
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-3 rounded-lg border-2 border-[#155E49] px-5 py-3 text-[#155E49] font-medium hover:bg-[#155E49]/5"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md">
                  {/* Arrow icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path d="M9 5l-7 7 7 7" />
                    <path d="M2 12h20" />
                  </svg>
                </span>
                Log Out
              </button>
            </div>
          </aside>

          {/* Vertical Divider */}
          <div className="w-px bg-gray-300" />

          {/* RIGHT: Tab Content */}
          <main className="flex-1">
            {/* 🚨 Hapus cek isLoading dan error karena sudah diatasi di atas */}
            {user && active === "profile" && <ProfileForm user={user} />}
            {active === "order" && <OrderHistory />}
            {active === "promo" && (
              <Placeholder
                title="Promo Info"
                subtitle="Informasi promo yang tersedia untuk akun Anda."
              />
            )}
            {active === "voucher" && <VoucherList />}
          </main>
        </div>
      </div>
    </div>
  );
}

// 🚨 PERUBAHAN 5: Ganti AccountUser menjadi AuthUser (diimpor dari authSlice)
function ProfileForm({ user }: { user: AuthUser }) {
  return (
    <div>
      <h2 className="text-2xl md:text-[28px] font-bold text-gray-900">
        Profile
      </h2>
      <span className="block mt-2 text-sm text-gray-500">
        User ID (Testing) : {user.id}
      </span>
      <form className="mt-6 md:mt-8">
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          <Input placeholder="Email" value={user.email} />
          <Input placeholder="Nama" value={user.name} />
          <Input placeholder="Whatsapp" value={user.whatsapp} />
          <Input placeholder="Address" value={user.address} />
          <Input placeholder="Province" value={user.province} />
          <Input placeholder="City" value={user.city} />
          <Input placeholder="District" value={user.district} />
          <Input placeholder="Postal Code" value={user.postalCode} />
          {/* Form fields lainnya */}
        </div>

        <div className="mt-8 md:mt-10">
          <button
            type="button"
            className="mx-auto block w-[260px] md:w-[300px] rounded-md bg-[#155E49] px-6 py-3 text-white font-semibold hover:opacity-95"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}

// Komponen lainnya (TabButton, Input, Placeholder) tetap sama...
function Input({
  placeholder,
  value,
}: {
  placeholder: string;
  value: string | null | undefined;
}) {
  return (
    <input
      type="text"
      value={value ?? ""}
      readOnly
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155E49]"
    />
  );
}

function Placeholder({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-2xl md:text-[28px] font-bold text-gray-900">
        {title}
      </h2>
      <p className="mt-2 text-gray-500">{subtitle}</p>
    </div>
  );
}
