"use client"
import Blog1 from "./Blog1"

interface Blog1AuthorProps {
  selectedAuthor?: string;
  title?: string;
  subtitle?: string;
  isPremiumOnly?: boolean;
}

export default function Blog1Author({ selectedAuthor, title, subtitle, isPremiumOnly }: Blog1AuthorProps) {
  return <Blog1 selectedAuthor={selectedAuthor} title={title} subtitle={subtitle} isPremiumOnly={isPremiumOnly} />;
} 