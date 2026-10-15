"use client";

import { useEffect } from "react";
import { initWowScrollAnimations } from "@/lib/wow/scrollAnimations";

export default function WowProvider({ children }) {
  useEffect(() => initWowScrollAnimations(), []);
  return children;
}
