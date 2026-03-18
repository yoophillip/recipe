import { redirect, notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getCategories } from "@/lib/queries/categories";
import { getRecipeById } from "@/lib/queries/recipes";
import { RecipeForm } from "@/components/admin/recipe-form";

interface Props {
  params: { id: string };
}

export default async function EditRecipePage({ params }: Props) {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const [categories, recipe] = await Promise.all([
    getCategories(),
    getRecipeById(Number(params.id)),
  ]);

  if (!recipe) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Recipe</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update &ldquo;{recipe.title}&rdquo;
        </p>
      </div>
      <RecipeForm categories={categories} recipe={recipe} />
    </div>
  );
}
