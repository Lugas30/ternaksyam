"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import axios from "axios";
import formatToIDR from "@/utils/formatToIdr";
import { getGuestToken } from "@/utils/guestToken";
import { toast } from "react-toastify";
import { clearCart } from "@/redux/slices/cartSlice";
import { useDispatch } from "react-redux"; // Tidak perlu import useSelector terpisah jika sudah ada useAppSelector
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const dispatch = useDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);
  const { user, isUserLoading } = useAppSelector((state) => state.auth);
  const [province, setProvince] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherData, setVoucherData] = useState<any>(null);
  const [layanan, setLayanan] = useState([]);
  const sessionToken = getGuestToken();
  const [loading, setLoading] = useState(false);

  const totalWeight = cartItems.reduce(
    (total, item: any) => total + item.sizeName,
    0
  );

  const totalHarga = cartItems.reduce(
    (total, item: any) => total + item.total,
    0
  );

  const kurir = [
    { id: 1, name: "SICEPAT", slug: "sicepat" },
    { id: 2, name: "JNE", slug: "jne" },
    { id: 3, name: "JNT", slug: "jnt" },
    { id: 4, name: "NINJA", slug: "ninja" },
  ];

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    district_name: "",
    city: "",
    city_name: "",
    province: "",
    province_name: "",
    postalCode: "",
    voucher: voucherCode,
    kurir: "",
    cost: 0,
    service: "",
    etd: "",
  });

  const router = useRouter();

  // ✅ Ambil daftar provinsi sekali saat komponen mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/provinces`
        );
        setProvince(response.data.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  // ✅ Ambil daftar kota setiap kali province berubah
  useEffect(() => {
    const fetchCities = async () => {
      if (!data.province) return; // stop kalau belum pilih provinsi
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/cities/${data.province}`
        );
        setCities(response.data.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, [data.province]);

  // ✅ Ambil daftar kecamatan setiap kali kota berubah
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!data.city) return; // stop kalau belum pilih kota
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/districts/${data.city}`
        );
        setDistricts(response.data.data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();
  }, [data.city]);

  // handle layanan kurir
  useEffect(() => {
    const fetchLayanan = async () => {
      if (!data.kurir) return;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/cost/${data.district}/${totalWeight}/${data.kurir}`
        );
        setLayanan(response.data.data);
      } catch (error) {
        console.error("Error fetching layanan:", error);
      }
    };

    fetchLayanan();
  }, [data.district, data.kurir]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle apply voucher
  const handleApplyVoucher = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/apply-voucher`,
        {
          user_id: user?.id ?? null,
          code: voucherCode,
          session: sessionToken,
          total: totalHarga,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data.data;
      setVoucherData(data);

      toast.success(`Voucher berhasil diterapkan! 🎉`);
    } catch (error: any) {
      // Jika ada response dari API
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Gagal menerapkan voucher. Coba lagi!");
      }
    }
  };

  const totalAkhir =
    totalHarga + data.cost - (voucherData?.discount_value || 0);

  // handle checkout
  const handleCheckout = async () => {
    setLoading(true);
    try {
      let cartId = null;

      // 1️⃣ Tambahkan item ke cart (berurutan)
      for (const item of cartItems) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/cart/add`,
          {
            product_id: item.sizeId,
            user_id: user?.id ? Number(user?.id) : null,
            session: sessionToken,
            qty: item.quantity,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        if (!cartId) cartId = response.data.data.cart_id;
      }

      // 2️⃣ Siapkan payload transaksi
      const payload = {
        voucher_code: data.voucher,
        cart_id: cartId,
        name: data.name || user?.name,
        email: data.email || user?.email,
        address: data.address || user?.address,
        province: data.province_name,
        city: data.city_name,
        district: data.district_name,
        destination_id: data.district,
        postal_code: data.postalCode || user?.postalCode,
        phone: data.phone || user?.whatsapp,
        courier: data.kurir,
        service: data.service,
        cost: data.cost,
        etd: data.etd || "2-3 Hari",
        total: totalAkhir,
        note: "",
        total_weight: totalWeight,
      };

      // 3️⃣ Kirim ke API /transaction
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("📦 Response transaksi:", response.data);

      // 4️⃣ Ambil nomor invoice dan email user untuk diteruskan ke halaman thank you
      const invoiceNumber = response.data.invoice;
      const userEmail = payload.email;

      // 4️⃣ Ambil token Midtrans
      const snapToken =
        response.data.data?.snap_token || response.data.snap_token;

      if (snapToken && typeof window !== "undefined" && window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: function (result: any) {
            dispatch(clearCart());
            toast.success("Pembayaran berhasil! 🎉");
            // Jika transaksi sukses, arahkan ke halaman success
            // router.push("/thankyou");
            router.push(
              `/thankyou?invoice=${invoiceNumber}&email=${userEmail}`
            );
          },
          onPending: function (result: any) {
            dispatch(clearCart());
            toast.info(
              "Pembayaran masih pending. Silakan selesaikan di Midtrans."
            );
            // Jika transaksi belum selesai, arahkan ke halaman pending
            // router.push("/thankyou");
            router.push(
              `/thankyou?invoice=${invoiceNumber}&email=${userEmail}`
            );
          },
          onError: function (result: any) {
            dispatch(clearCart());
            toast.error("Pembayaran gagal. Coba lagi!");
          },
          onClose: function () {
            dispatch(clearCart());
            toast.error("Pembayaran dibatalkan.");
          },
        });
      } else {
        console.error("Token Midtrans tidak ditemukan di response API");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Loading...</span>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Kolom Kiri */}
        <div className="space-y-8">
          {/* Contact */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-green-900">Contact</h2>
              <Link href="/login" className="text-sm text-green-700">
                Masuk Akun
              </Link>
            </div>
            <input
              type="email"
              placeholder="Email"
              value={data.email || user?.email || ""}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full h-11 rounded-md border border-gray-300 px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600/40"
            />
          </section>

          {/* Pengiriman */}
          <section>
            <h2 className="text-2xl font-semibold text-green-900 mb-4">
              Pengiriman
            </h2>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={data.name || user?.name || ""}
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
              }}
              className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-600/40"
            />
            <input
              type="text"
              placeholder="Alamat"
              value={data.address || user?.address || ""}
              onChange={(e) => {
                setData({ ...data, address: e.target.value });
              }}
              className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-600/40"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* PROVINCE */}
              <select
                name="province"
                value={
                  data.province
                    ? JSON.stringify({
                        id: data.province,
                        name: data.province_name,
                      })
                    : ""
                }
                onChange={(e) => {
                  if (!e.target.value) return; // handle default option
                  const selected = JSON.parse(e.target.value);
                  setData((prev) => ({
                    ...prev,
                    province: selected.id,
                    province_name: selected.name,
                    city: "", // reset city kalau province berubah
                    city_name: "",
                  }));
                }}
                className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600/40"
              >
                <option value="">- Pilih Provinsi -</option>
                {province.map((prov: any) => (
                  <option
                    key={prov.id}
                    value={JSON.stringify({ id: prov.id, name: prov.name })}
                  >
                    {prov.name}
                  </option>
                ))}
              </select>

              {/* CITY */}
              <select
                name="city"
                value={
                  data.city
                    ? JSON.stringify({ id: data.city, name: data.city_name })
                    : ""
                }
                onChange={(e) => {
                  if (!e.target.value) return;
                  const selected = JSON.parse(e.target.value);
                  setData((prev) => ({
                    ...prev,
                    city: selected.id,
                    city_name: selected.name,
                  }));
                }}
                disabled={!cities.length}
                className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600/40"
              >
                <option value="">- Pilih Kota -</option>
                {cities.map((city: any) => (
                  <option
                    key={city.id}
                    value={JSON.stringify({ id: city.id, name: city.name })}
                  >
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                name="district"
                value={
                  data.district
                    ? JSON.stringify({
                        id: data.district,
                        name: data.district_name,
                      })
                    : ""
                }
                onChange={(e) => {
                  if (!e.target.value) return;
                  const selected = JSON.parse(e.target.value);

                  setData((prev) => ({
                    ...prev,
                    district: selected.id,
                    district_name: selected.name,
                  }));
                }}
                disabled={!districts.length}
                className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600/40"
              >
                <option value="">- Pilih Kecamatan -</option>
                {districts.map((district: any) => (
                  <option
                    key={district.id}
                    value={JSON.stringify({
                      id: district.id,
                      name: district.name,
                    })}
                  >
                    {district.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Kode Pos"
                value={data.postalCode || user?.postalCode || ""}
                onChange={(e) => {
                  setData({ ...data, postalCode: e.target.value });
                }}
                className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600/40"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="No Whatsapp"
                value={data.phone || user?.whatsapp || ""}
                onChange={(e) => {
                  setData({ ...data, phone: e.target.value });
                }}
                className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600/40"
              />
              <select
                name="kurir"
                value={data.kurir}
                onChange={handleChange}
                className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600/40"
              >
                <option value="">- Pilih Kurir -</option>
                {kurir.map((kurir: any) => (
                  <option key={kurir.id} value={kurir.slug}>
                    {kurir.name}
                  </option>
                ))}
              </select>
            </div>

            <select
              name="cost"
              className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600/40"
              value={JSON.stringify({
                cost: data.cost,
                service: data.service,
                etd: data.etd,
              })}
              onChange={(e) => {
                const selected = JSON.parse(e.target.value);
                setData((prev) => ({
                  ...prev,
                  cost: selected.cost,
                  service: selected.service,
                  etd: selected.etd,
                }));
              }}
            >
              <option value="">- Pilih Layanan -</option>

              {layanan.map((item: any, index) => (
                <option
                  key={index}
                  value={JSON.stringify({
                    cost: item.cost,
                    service: item.service,
                    etd: item.etd,
                  })}
                >
                  {item.service} - {formatToIDR(item.cost)} ({item.etd} hari)
                </option>
              ))}
            </select>
          </section>

          {/* Pembayaran */}
          <section>
            <h2 className="text-2xl font-semibold text-green-900 mb-2">
              Pembayaran
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Transactions are secure and encrypted.
            </p>
            <div className="border rounded-lg overflow-hidden mb-6">
              <div className="px-4 py-3 flex justify-between items-center bg-gray-50 border-b">
                <span className="text-sm font-medium">Payments By Xendit</span>
                <div className="flex gap-2">
                  <span className="border px-2 py-1 text-xs rounded">VISA</span>
                  <span className="border px-2 py-1 text-xs rounded">
                    MasterCard
                  </span>
                  <span className="border px-2 py-1 text-xs rounded">BCA</span>
                </div>
              </div>
            </div>
            <button
              disabled={loading}
              type="submit"
              onClick={handleCheckout}
              className="w-full h-12 bg-green-900 text-white font-semibold rounded-md hover:bg-green-800 cursor-pointer"
            >
              {loading ? "Loading..." : "Bayar Sekarang"}
            </button>
          </section>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-6">
          {/* Pesanan */}
          <section>
            <h2 className="text-2xl font-semibold text-green-900 mb-4">
              Pesanan
            </h2>
            <div className="space-y-4">
              {/* Cart Item */}
              {cartItems.map((item, idx) => (
                <div className="flex justify-between items-start" key={idx}>
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-16 w-16 rounded border object-cover"
                      />
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">{item.sizeName}</p>
                      <p className="text-sm text-gray-600">
                        {item.flavourName}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{formatToIDR(item.total)}</p>
                </div>
              ))}
            </div>

            {/* Voucher */}
            <div className="flex items-center gap-2 mt-6">
              <input
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                placeholder="Voucher"
                className="h-11 rounded-md border border-gray-300 px-3 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-green-600/40"
              />
              <button
                onClick={handleApplyVoucher}
                disabled={!voucherCode}
                className={`h-11 px-4 rounded-md font-semibold ${
                  voucherCode
                    ? "bg-green-900 text-white cursor-pointer"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Gunakan
              </button>
            </div>
          </section>

          {/* Ringkasan */}
          <section>
            <h2 className="text-2xl font-semibold text-green-900 mb-4">
              Ringkasan
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatToIDR(totalHarga)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{formatToIDR(data.cost)}</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span>Discount</span>
                <span>{formatToIDR(voucherData?.discount_value || 0)}</span>
              </div>
              <p className="text-xs text-green-700">
                {voucherData?.voucher_type
                  ? voucherData.voucher_type.charAt(0).toUpperCase() +
                    voucherData.voucher_type.slice(1)
                  : ""}
              </p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between items-center">
              <span className="text-lg">Total</span>
              <span className="text-2xl font-semibold">
                {formatToIDR(totalAkhir)}
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
