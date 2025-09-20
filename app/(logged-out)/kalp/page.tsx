"use client";
import dynamic from "next/dynamic";

const Services7 = dynamic(() => import("@/components/sections/Services7"), {
  ssr: false,
});

export default function KalpPage() {
  return (
    <>
      {/* Services 7 - Kalp Section */}
      <Services7 />
    </>
  );
}
