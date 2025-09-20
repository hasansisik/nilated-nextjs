"use client"
import Blog2 from "./Blog2"

interface Blog2AuthorProps {
  selectedAuthor?: string;
  title?: string;
  subtitle?: string;
  isPremiumOnly?: boolean;
}

export default function Blog2Author({ selectedAuthor, title, subtitle, isPremiumOnly }: Blog2AuthorProps) {
  return <Blog2 selectedAuthor={selectedAuthor} title={title} subtitle={subtitle} isPremiumOnly={isPremiumOnly} />;
} 