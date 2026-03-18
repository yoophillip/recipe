import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getCategories } from "@/lib/queries/categories";
import { getRecipeCount } from "@/lib/queries/recipes";
import { CategoryManager } from "@/components/admin/category-manager";

export default async function CategoriesPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const categories = await getCategories();
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => ({
      ...cat,
      recipeCount: await getRecipeCount(cat.id),
    }))
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage recipe categories.
        </p>
      </div>
      <CategoryManager categories={categoriesWithCounts} />
    </div>
  );
}
