"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  activeSlug?: string;
}

export function CategoryFilter({ categories, activeSlug }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/recipes"
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-colors",
          !activeSlug
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground hover:text-foreground"
        )}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/categories/${cat.slug}`}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            activeSlug === cat.slug
              ? "text-white"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
          style={
            activeSlug === cat.slug
              ? { backgroundColor: cat.color }
              : undefined
          }
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
