"use client"
import Blog1 from "./Blog1"

interface Blog1CategoryProps {
  selectedCategory?: string;
  title?: string;
  subtitle?: string;
  isPremiumOnly?: boolean;
}

export default function Blog1Category({ selectedCategory, title, subtitle, isPremiumOnly }: Blog1CategoryProps) {
  return <Blog1 selectedCategory={selectedCategory} title={title} subtitle={subtitle} isPremiumOnly={isPremiumOnly} />;
} 