import { RecipeCard } from "./recipe-card";
import type { RecipeWithCategory } from "@/types";

interface RecipeGridProps {
  recipes: RecipeWithCategory[];
}

export function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
