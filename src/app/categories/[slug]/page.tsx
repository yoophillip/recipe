import { notFound } from "next/navigation";
import { ArrowLeft, Utensils } from "lucide-react";
import Link from "next/link";
import { RecipeGrid } from "@/components/recipe/recipe-grid";
import { CategoryFilter } from "@/components/search/category-filter";
import { EmptyState } from "@/components/ui/empty-state";
import { getCategoryBySlug } from "@/lib/queries/categories";
import { getCategories } from "@/lib/queries/categories";
import { getRecipes } from "@/lib/queries/recipes";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: "Category Not Found" };
  return { title: `${category.name} Recipes` };
}

export default async function CategoryPage({ params }: Props) {
  const [category, allCategories] = await Promise.all([
    getCategoryBySlug(params.slug),
    getCategories(),
  ]);

  if (!category) notFound();

  const recipes = await getRecipes({ categoryId: category.id });

  return (
    <div className="mx-auto max-w-container px-4 sm:px-6 py-10">
      <Link
        href="/recipes"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        All recipes
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">
          {category.name}
        </h1>
        <p className="text-muted-foreground">
          {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
        </p>
      </div>

      <div className="mb-8">
        <CategoryFilter categories={allCategories} activeSlug={params.slug} />
      </div>

      {recipes.length > 0 ? (
        <RecipeGrid recipes={recipes} />
      ) : (
        <EmptyState
          icon={Utensils}
          title={`No ${category.name.toLowerCase()} recipes yet`}
          description="Recipes in this category will appear here once they're added."
        />
      )}
    </div>
  );
}
