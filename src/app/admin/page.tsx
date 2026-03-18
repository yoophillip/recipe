import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Plus, Pencil } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { getRecipes, getRecipeCount } from "@/lib/queries/recipes";
import { getCategories } from "@/lib/queries/categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteRecipeButton } from "@/components/admin/delete-recipe-button";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboard() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const [recipes, categories, totalCount] = await Promise.all([
    getRecipes({ limit: 100 }),
    getCategories(),
    getRecipeCount(),
  ]);

  const categoryCounts = await Promise.all(
    categories.map(async (cat) => ({
      ...cat,
      count: await getRecipeCount(cat.id),
    }))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your recipe collection.
          </p>
        </div>
        <Link href="/admin/recipes/new">
          <Button size="md">
            <Plus className="h-4 w-4" />
            Add Recipe
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground mb-1">Total Recipes</p>
          <p className="text-2xl font-semibold">{totalCount}</p>
        </div>
        {categoryCounts.map((cat) => (
          <div key={cat.id} className="rounded-xl border border-border p-5">
            <p className="text-sm text-muted-foreground mb-1">{cat.name}</p>
            <p className="text-2xl font-semibold">{cat.count}</p>
          </div>
        ))}
      </div>

      {/* Recipe Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left font-medium p-4">Recipe</th>
                <th className="text-left font-medium p-4 hidden sm:table-cell">Category</th>
                <th className="text-left font-medium p-4 hidden md:table-cell">Added</th>
                <th className="text-right font-medium p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr
                  key={recipe.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{recipe.title}</p>
                      <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1 sm:hidden">
                        {recipe.category.name}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <Badge color={recipe.category.color}>
                      {recipe.category.name}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">
                    {formatDate(recipe.createdAt)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/recipes/${recipe.id}/edit`}>
                        <button className="rounded-lg p-2 hover:bg-muted transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Link>
                      <DeleteRecipeButton recipeId={recipe.id} recipeName={recipe.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {recipes.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No recipes yet</p>
            <p className="text-sm mt-1">Add your first recipe to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
