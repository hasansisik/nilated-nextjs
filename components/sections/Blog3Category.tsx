"use client"
import Blog3 from "./Blog3"

interface Blog3CategoryProps {
  selectedCategory?: string;
  title?: string;
  subtitle?: string;
  isPremiumOnly?: boolean;
}

export default function Blog3Category({ selectedCategory, title, subtitle, isPremiumOnly }: Blog3CategoryProps) {
  return <Blog3 selectedCategory={selectedCategory} title={title} subtitle={subtitle} isPremiumOnly={isPremiumOnly} />;
} 