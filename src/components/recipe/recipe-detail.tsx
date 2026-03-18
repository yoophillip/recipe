import Image from "next/image";
import { CategoryBadge } from "./category-badge";
import { TimeDisplay } from "./time-display";
import { FavoriteButton } from "./favorite-button";
import type { RecipeWithCategory } from "@/types";

interface RecipeDetailProps {
  recipe: RecipeWithCategory;
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  return (
    <article className="max-w-3xl mx-auto">
      {/* Hero Image */}
      {recipe.imageUrl && (
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8 bg-muted">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <CategoryBadge category={recipe.category} />
          {Array.isArray(recipe.tags) && recipe.tags.length > 0 && (
            <div className="flex gap-1.5">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight mb-2">
              {recipe.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {recipe.description}
            </p>
          </div>
          <FavoriteButton recipeId={recipe.id} />
        </div>

        <div className="mt-4">
          <TimeDisplay
            prepTime={recipe.prepTime}
            cookTime={recipe.cookTime}
            servings={recipe.servings}
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-[1fr_2fr] gap-8">
        {/* Ingredients */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
          <ul className="space-y-2.5">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-baseline gap-2 text-sm leading-relaxed"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                <span>
                  <span className="font-medium">
                    {ing.amount} {ing.unit}
                  </span>{" "}
                  {ing.item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="space-y-5">
            {recipe.instructions.map((inst) => (
              <li key={inst.step} className="flex gap-4">
                <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                  {inst.step}
                </span>
                <p className="text-sm leading-relaxed pt-0.5">{inst.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}
