import Link from "next/link";
import { ChefHat, Wine, Cake, Flame, ArrowRight } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { RecipeGrid } from "@/components/recipe/recipe-grid";
import { getCategories } from "@/lib/queries/categories";
import { getRecentRecipes, getRecipeCount } from "@/lib/queries/recipes";

const categoryIcons: Record<string, typeof Flame> = {
  flame: Flame,
  wine: Wine,
  cake: Cake,
};

export default async function HomePage() {
  const [categoriesData, recentRecipes] = await Promise.all([
    getCategories(),
    getRecentRecipes(6),
  ]);

  const categoriesWithCounts = await Promise.all(
    categoriesData.map(async (cat) => ({
      ...cat,
      count: await getRecipeCount(cat.id),
    }))
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-muted">
        <div className="mx-auto max-w-container px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-2xl bg-primary/10 p-4">
                <ChefHat className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
              Recipe Collection
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Your personal library of cooking, drink, and dessert recipes.
              Find something delicious.
            </p>
            <SearchBar large className="max-w-lg mx-auto" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-container px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight mb-8">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categoriesWithCounts.map((cat) => {
            const Icon = categoryIcons[cat.icon || ""] || ChefHat;
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group flex items-center gap-4 p-5 rounded-xl border border-border bg-background hover:shadow-md transition-all duration-200"
              >
                <div
                  className="flex items-center justify-center h-12 w-12 rounded-xl"
                  style={{ backgroundColor: `${cat.color}18` }}
                >
                  <Icon className="h-6 w-6" style={{ color: cat.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {cat.count} {cat.count === 1 ? "recipe" : "recipes"}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Recipes */}
      {recentRecipes.length > 0 && (
        <section className="mx-auto max-w-container px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Recently Added
            </h2>
            <Link
              href="/recipes"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <RecipeGrid recipes={recentRecipes} />
        </section>
      )}
    </div>
  );
}
