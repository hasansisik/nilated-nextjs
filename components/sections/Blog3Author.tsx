"use client"
import Blog3 from "./Blog3"

interface Blog3AuthorProps {
  selectedAuthor?: string;
  title?: string;
  subtitle?: string;
  isPremiumOnly?: boolean;
}

export default function Blog3Author({ selectedAuthor, title, subtitle, isPremiumOnly }: Blog3AuthorProps) {
  return <Blog3 selectedAuthor={selectedAuthor} title={title} subtitle={subtitle} isPremiumOnly={isPremiumOnly} />;
} 