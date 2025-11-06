"use client";

import React, { useState } from "react";
import axios from "axios";

type FormState = {
  name: string;
  whatsapp: string;
  email: string;
  address: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  bank: string;
  account_name: string;
  account_number: string;
  agree: boolean;
};

const daftarReseller: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    whatsapp: "",
    email: "",
    address: "",
    province: "",
    city: "",
    district: "",
    postal_code: "",
    bank: "",
    account_name: "",
    account_number: "",
    agree: false,
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    type: "" | "success" | "error";
    message: string;
  }>({
    type: "",
    message: "",
  });

  // onChange untuk semua <input> (termasuk checkbox) — TIDAK DIUBAH
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onlyDigits = (s: string) => s.replace(/\D/g, "");

  // Submit form — TIDAK DIUBAH
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    // Validasi minimal — TIDAK DIUBAH
    if (!form.agree) {
      setStatus({
        type: "error",
        message: "Anda harus menyetujui S&K terlebih dahulu.",
      });
      return;
    }
    if (!form.name || !form.whatsapp || !form.email || !form.address) {
      setStatus({
        type: "error",
        message: "Nama, WhatsApp, Email, dan Alamat wajib diisi.",
      });
      return;
    }

    const payload = {
      name: form.name.trim(),
      whatsapp: onlyDigits(form.whatsapp),
      email: form.email.trim(),
      address: form.address.trim(),
      province: form.province.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      postal_code: form.postal_code.trim(),
      bank: form.bank.trim(),
      account_name: form.account_name.trim(),
      account_number: onlyDigits(form.account_number),
    };

    try {
      setSubmitting(true);
      await axios.post("https://ts.crx.my.id/api/reseller/register", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setStatus({
        type: "success",
        message:
          "Pendaftaran berhasil! Kami akan menghubungi Anda via WhatsApp/Email.",
      });

      setForm({
        name: "",
        whatsapp: "",
        email: "",
        address: "",
        province: "",
        city: "",
        district: "",
        postal_code: "",
        bank: "",
        account_name: "",
        account_number: "",
        agree: false,
      });
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan. Coba lagi.";
      setStatus({ type: "error", message: apiMsg });
    } finally {
      setSubmitting(false);
    }
  };

  // helper: tutup modal tanpa mengubah alur bisnis
  const closeModal = () => setStatus({ type: "", message: "" });

  return (
    <main className="min-h-screen bg-base-100 text-base-content">
      <div className="mx-auto w-full max-w-sm md:max-w-md px-4 py-10">
        {/* Header ala affiliate */}
        <h1 className="text-3xl font-extrabold text-center text-primary">
          Daftar Reseller
        </h1>
        <p className="mt-2 text-center text-sm text-base-content/70">
          Harap isi form berikut ini dengan data yang valid
        </p>

        {/* Card Form ala affiliate */}
        <div className="card bg-white shadow-md mt-6">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Section: Data Diri */}
              <p className="font-semibold text-sm text-base-content/80">
                Data Diri Mitra
              </p>

              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Nama Lengkap"
                className="input input-bordered w-full"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  name="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={onChange}
                  placeholder="No WhatsApp"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="input input-bordered w-full tabular-nums"
                  required
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Email"
                  type="email"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <input
                name="address"
                value={form.address}
                onChange={onChange}
                placeholder="Alamat Lengkap"
                className="input input-bordered w-full"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  name="province"
                  value={form.province}
                  onChange={onChange}
                  placeholder="Provinsi"
                  className="input input-bordered w-full"
                  required
                />

                <input
                  name="city"
                  value={form.city}
                  onChange={onChange}
                  placeholder="Kota"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  name="district"
                  value={form.district}
                  onChange={onChange}
                  placeholder="Kecamatan"
                  className="input input-bordered w-full"
                  required
                />
                <input
                  name="postal_code"
                  value={form.postal_code}
                  onChange={onChange}
                  placeholder="Kode Pos"
                  inputMode="numeric"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* Section: Rekening */}
              <p className="font-semibold text-sm text-base-content/80 mt-2">
                Data Rekening Pembayaran
              </p>

              <input
                name="bank"
                value={form.bank}
                onChange={onChange}
                placeholder="Nama Bank (contoh: BCA, BRI, Mandiri)"
                className="input input-bordered w-full"
                required
              />
              <input
                name="account_number"
                value={form.account_number}
                onChange={onChange}
                placeholder="No Rekening"
                inputMode="numeric"
                className="input input-bordered w-full"
                required
              />
              <input
                name="account_name"
                value={form.account_name}
                onChange={onChange}
                placeholder="Nama Rekening"
                className="input input-bordered w-full"
                required
              />

              {/* Agreement ala affiliate */}
              <div className="form-control mt-2">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={onChange}
                    className="checkbox checkbox-sm"
                  />
                  <span className="label-text text-sm">
                    Menyetujui <a className="underline">Syarat dan Ketentuan</a>{" "}
                    yang berlaku
                  </span>
                </label>
              </div>

              {/* Button ala affiliate */}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full mt-2"
              >
                {submitting ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Daftar Sekarang"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Catatan ala affiliate di bawah tombol */}
        <div className="bg-yellow-100 rounded-box p-4 mt-6 text-sm text-base-content/80">
          Konfirmasi pendaftaran akan dikirimkan ke email anda, <br />
          Tim kami akan menghubungi anda dalam 2×24 Jam
        </div>
      </div>

      {/* Modal Sukses — tampilan identik seperti affiliate, logika tetap pakai state `status` */}
      <dialog
        className={`modal ${status.type === "success" ? "modal-open" : ""}`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Pendaftaran Berhasil!</h3>
          <p className="py-4">
            {status.message ||
              "Pendaftaran berhasil. Tim kami akan menghubungi Anda dalam 2×24 jam."}
          </p>
          <div className="modal-action">
            <button className="btn" onClick={closeModal}>
              Tutup
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>

      {/* Modal Error — tampilan identik seperti affiliate */}
      <dialog
        className={`modal ${status.type === "error" ? "modal-open" : ""}`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Pendaftaran Gagal</h3>
          <p className="py-4">
            {status.message || "Terjadi kesalahan. Silakan coba lagi."}
          </p>
          <div className="modal-action">
            <button className="btn" onClick={closeModal}>
              Tutup
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>
    </main>
  );
};

export default daftarReseller;
