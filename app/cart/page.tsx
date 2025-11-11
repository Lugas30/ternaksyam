"use client";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  removeItemFromCart,
  updateItemQuantity,
  setCartMeta,
} from "@/redux/slices/cartSlice";
import { addToCart } from "@/redux/thunks/cartThunk";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);

  // 🚨 PERUBAHAN UTAMA: Ambil user dari state.auth, bukan state.account
  const user = useAppSelector((state) => state.auth.user); // Ambil objek user jika login

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (id: string, type: "increase" | "decrease") => {
    const item = cartItems.find((cartItem) => cartItem.sizeId === id);
    if (!item) return;

    let newQuantity =
      type === "increase" ? item.quantity + 1 : item.quantity - 1;
    if (newQuantity < 1) newQuantity = 1;

    dispatch(
      updateItemQuantity({ sizeId: item.sizeId, quantity: newQuantity })
    );
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeItemFromCart(id));
  };

  const subTotal = cartItems.reduce(
    (acc, item) =>
      acc + Number((item.price_discount ?? item.price) * item.quantity),
    0
  );

  // === Kirim items ke API sesuai alur: tamu atau login ===
  const proceedCheckout = async (asGuest: boolean) => {
    // 💡 Anda mungkin perlu menggunakan user.id di sini jika API /checkout memerlukannya
    const userId = user?.id || null;

    try {
      setLoading(true);

      // Catatan: Jika Anda perlu menyimpan ID pengguna ke Redux Cart Slice,
      // Anda bisa menggunakan setCartMeta di sini:
      // dispatch(setCartMeta({ userId: asGuest ? null : userId }));

      router.push("/checkout");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Gagal memproses checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setShowModal(true); // tampilkan modal jika belum login
      return;
    }
    await proceedCheckout(false); // user login
  };

  return (
    <div className="container mx-auto p-6">
      {/* Render UI jika cart kosong */}
      {cartItems.length === 0 ? (
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Keranjang Kosong</h1>
          <p className="text-gray-600 mb-8">
            Tidak ada produk dalam keranjang.
          </p>
          <Link
            href="/shop"
            className="px-6 py-3 bg-primary text-white rounded-lg inline-block"
          >
            Lanjutkan Belanja
          </Link>
        </div>
      ) : (
        <>
          {/* Render tabel cart */}
          <div className="overflow-x-auto shadow-md border border-gray-200 rounded-lg">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">
                    PRODUK
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">
                    HARGA
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">
                    JUMLAH
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">
                    TOTAL
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">
                    HAPUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const unit = Number(item.price_discount ?? item.price);
                  return (
                    <tr
                      key={`${item.sizeId}-${item.flavourName}-${item.sizeName}`}
                      className="border-t"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-16 h-16 object-cover mr-4 rounded"
                          />
                          <div>
                            <h3 className="font-semibold">
                              {item.productName}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {item.sizeName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.flavourName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {unit < Number(item.price) ? (
                          <>
                            <span className="line-through text-gray-400 pr-2">
                              Rp {Number(item.price).toLocaleString()}
                            </span>
                            <span className="text-gray-600 font-medium">
                              Rp {unit.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-600 font-medium">
                            Rp {Number(item.price).toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.sizeId, "decrease")
                            }
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.sizeId, "increase")
                            }
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        Rp {(unit * item.quantity).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRemoveItem(item.sizeId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Subtotal */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-xl font-semibold">SUBTOTAL</div>
            <div className="text-xl font-semibold">
              Rp {Number(subTotal).toLocaleString()}
            </div>
          </div>

          {/* Tombol Checkout */}
          <div className="mt-4 flex justify-between items-center">
            <Link href="/shop" className="text-primary text-sm">
              Lanjutkan Belanja
            </Link>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-lg cursor-pointer disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Checkout"}
            </button>
          </div>
        </>
      )}

      {/* Modal “Belum Masuk Akun” (Tidak ada perubahan yang diperlukan di sini) */}
      {showModal && (
        <div
          className="fixed inset-0 z-999 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-[92%] max-w-[560px] rounded-xl bg-white p-6 md:p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-[28px] md:text-[32px] leading-tight font-semibold text-[#0E5A45] mb-4">
              Hai, Kamu Belum Masuk Akun
            </h2>
            <p className="text-[15px] md:text-[16px] text-gray-600 leading-relaxed mb-6">
              Masuk akun untuk menikmati pengalaman personal dan mengakses semua
              layanan kami.
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                router.push("/login?redirect=/checkout");
              }}
              className="w-full h-12 md:h-14 rounded-md bg-[#0E5A45] text-white text-[16px] md:text-[18px] font-semibold transition-colors hover:bg-[#0c4d3b] mb-2"
            >
              Masuk akun
            </button>
            <p className="text-center text-[13px] text-gray-600 mt-2 mb-3">
              Belum punya akun ?
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                router.push("/register?redirect=/checkout");
              }}
              className="w-full h-12 md:h-14 rounded-md border border-[#0E5A45] text-[#0E5A45] text-[16px] md:text-[18px] font-semibold mb-3 hover:bg-green-50"
            >
              Daftarkan diri
            </button>
            <button
              onClick={() => {
                setShowModal(false);
                proceedCheckout(true); // lanjut sebagai tamu (user_id = "")
              }}
              className="w-full h-12 md:h-14 rounded-md border border-[#0E5A45] text-[#0E5A45] text-[16px] md:text-[18px] font-semibold hover:bg-green-50"
            >
              Lanjut sebagai tamu
            </button>
            <div className="mt-6 rounded-md bg-[#FAFAF2] px-4 py-4 text-center">
              <p className="text-[12.5px] text-gray-700">
                "Dengan melanjutkan sebagai tamu, Anda tidak akan dapat melihat
                riwayat pesanan atau mendapatkan keuntungan akun."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
