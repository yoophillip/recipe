import { Utensils } from "lucide-react";
import { RecipeGrid } from "@/components/recipe/recipe-grid";
import { CategoryFilter } from "@/components/search/category-filter";
import { EmptyState } from "@/components/ui/empty-state";
import { getRecipes } from "@/lib/queries/recipes";
import { getCategories } from "@/lib/queries/categories";

export const metadata = { title: "All Recipes" };

export default async function RecipesPage() {
  const [recipes, categories] = await Promise.all([
    getRecipes(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-container px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          All Recipes
        </h1>
        <p className="text-muted-foreground">
          Browse our full collection of recipes.
        </p>
      </div>

      <div className="mb-8">
        <CategoryFilter categories={categories} />
      </div>

      {recipes.length > 0 ? (
        <RecipeGrid recipes={recipes} />
      ) : (
        <EmptyState
          icon={Utensils}
          title="No recipes yet"
          description="Recipes will appear here once they're added. Check back soon!"
        />
      )}
    </div>
  );
}
