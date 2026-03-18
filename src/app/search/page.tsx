import { Search } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { RecipeGrid } from "@/components/recipe/recipe-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { searchRecipes } from "@/lib/queries/recipes";

export const metadata = { title: "Search Recipes" };

interface Props {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || "";
  const results = query ? await searchRecipes(query) : [];

  return (
    <div className="mx-auto max-w-container px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight mb-4">
          Search Recipes
        </h1>
        <SearchBar defaultValue={query} className="max-w-lg" />
      </div>

      {query ? (
        <>
          <p className="text-sm text-muted-foreground mb-6">
            {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
          </p>
          {results.length > 0 ? (
            <RecipeGrid recipes={results} />
          ) : (
            <EmptyState
              icon={Search}
              title="No recipes found"
              description={`We couldn't find any recipes matching "${query}". Try a different search term.`}
            />
          )}
        </>
      ) : (
        <EmptyState
          icon={Search}
          title="Search for recipes"
          description="Type a recipe name, ingredient, or tag to find what you're looking for."
        />
      )}
    </div>
  );
}
