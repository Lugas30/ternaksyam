// Halaman Flash Sale
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Countdown from "react-countdown";
import goatsad from "@/public/images/ilustration/sheep-sad.png";

export default function FlashSale() {
  // --- 1. DEFINISI TIPE ---
  interface FlashSale {
    id: number;
    name: string;
    title: string;
    description: string;
    thumbnail: string;
    status: "active" | "inactive";
    start_date: string;
    end_date: string;
  }
  return <div>Flash Sale Page</div>;
}
