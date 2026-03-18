"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";

interface FavoriteButtonProps {
  recipeId: number;
  size?: "sm" | "md";
}

export function FavoriteButton({ recipeId, size = "md" }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(recipeId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(recipeId);
      }}
      className={cn(
        "rounded-full transition-colors duration-150",
        size === "sm" ? "p-1.5" : "p-2",
        favorited
          ? "text-destructive"
          : "text-muted-foreground hover:text-destructive"
      )}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
          favorited && "fill-current"
        )}
      />
    </button>
  );
}
