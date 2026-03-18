import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge } from "./category-badge";
import { TimeDisplay } from "./time-display";
import { FavoriteButton } from "./favorite-button";
import type { RecipeWithCategory } from "@/types";

interface RecipeCardProps {
  recipe: RecipeWithCategory;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card interactive>
        <div className="relative aspect-[4/3] bg-muted">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <span className="text-4xl">🍽</span>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full">
            <FavoriteButton recipeId={recipe.id} size="sm" />
          </div>
        </div>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <CategoryBadge category={recipe.category} />
          </div>
          <h3 className="font-semibold text-base mb-1 line-clamp-1">
            {recipe.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {recipe.description}
          </p>
          <TimeDisplay
            prepTime={recipe.prepTime}
            cookTime={recipe.cookTime}
            servings={recipe.servings}
          />
        </CardContent>
      </Card>
    </Link>
  );
}
