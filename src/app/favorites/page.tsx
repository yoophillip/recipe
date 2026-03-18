"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { RecipeGrid } from "@/components/recipe/recipe-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { RecipeGridSkeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/use-favorites";
import type { RecipeWithCategory } from "@/types";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [recipes, setRecipes] = useState<RecipeWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    async function fetchFavorites() {
      try {
        const params = new URLSearchParams();
        favorites.forEach((id) => params.append("ids", String(id)));
        const res = await fetch(`/api/recipes/search?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setRecipes(data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [favorites]);

  return (
    <div className="mx-auto max-w-container px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          Favorites
        </h1>
        <p className="text-muted-foreground">
          Your saved recipes, stored on this device.
        </p>
      </div>

      {loading ? (
        <RecipeGridSkeleton count={3} />
      ) : recipes.length > 0 ? (
        <RecipeGrid recipes={recipes} />
      ) : (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Tap the heart icon on any recipe to save it here for quick access."
        />
      )}
    </div>
  );
}
