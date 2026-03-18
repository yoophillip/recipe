import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getCategories } from "@/lib/queries/categories";
import { RecipeForm } from "@/components/admin/recipe-form";

export default async function NewRecipePage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const categories = await getCategories();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">New Recipe</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add a new recipe to your collection.
        </p>
      </div>
      <RecipeForm categories={categories} />
    </div>
  );
}
