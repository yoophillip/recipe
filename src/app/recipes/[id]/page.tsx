import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RecipeDetail } from "@/components/recipe/recipe-detail";
import { getRecipeById } from "@/lib/queries/recipes";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  const recipe = await getRecipeById(Number(params.id));
  if (!recipe) return { title: "Recipe Not Found" };
  return {
    title: recipe.title,
    description: recipe.description,
  };
}

export default async function RecipeDetailPage({ params }: Props) {
  const recipe = await getRecipeById(Number(params.id));
  if (!recipe) notFound();

  return (
    <div className="mx-auto max-w-container px-4 sm:px-6 py-10">
      <Link
        href="/recipes"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to recipes
      </Link>
      <RecipeDetail recipe={recipe} />
    </div>
  );
}
