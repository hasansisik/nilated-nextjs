"use client";

import { useSearchParams } from "next/navigation";
import Blog6 from "@/components/sections/Blog6";

export default function BlogCategory() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  
  return (
    <>
      <Blog6 selectedCategory={category} />
    </>
  );
}
