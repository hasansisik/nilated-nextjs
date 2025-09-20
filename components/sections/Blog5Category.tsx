"use client"
import Blog5 from "./Blog5"

interface Blog5CategoryProps {
  selectedCategory?: string;
  title?: string;
  subtitle?: string;
  isPremiumOnly?: boolean;
}

export default function Blog5Category({ selectedCategory, title, subtitle, isPremiumOnly }: Blog5CategoryProps) {
  return <Blog5 selectedCategory={selectedCategory} title={title} subtitle={subtitle} isPremiumOnly={isPremiumOnly} />;
} 