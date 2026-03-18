"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { recipes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";
import { createRecipeSchema } from "@/lib/validators";
import type { CreateRecipeInput } from "@/lib/validators";

export async function createRecipe(input: CreateRecipeInput) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  const result = createRecipeSchema.safeParse(input);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const data = result.data;

  const inserted = await db
    .insert(recipes)
    .values({
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      tags: data.tags,
      ingredients: data.ingredients,
      instructions: data.instructions,
      prepTime: data.prepTime ?? null,
      cookTime: data.cookTime ?? null,
      servings: data.servings ?? null,
      imageUrl: data.imageUrl || null,
      isFeatured: data.isFeatured,
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/recipes");
  revalidatePath("/admin");

  return { success: true, id: inserted[0].id };
}

export async function updateRecipe(id: number, input: CreateRecipeInput) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  const result = createRecipeSchema.safeParse(input);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const data = result.data;

  await db
    .update(recipes)
    .set({
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      tags: data.tags,
      ingredients: data.ingredients,
      instructions: data.instructions,
      prepTime: data.prepTime ?? null,
      cookTime: data.cookTime ?? null,
      servings: data.servings ?? null,
      imageUrl: data.imageUrl || null,
      isFeatured: data.isFeatured,
      updatedAt: sql`(datetime('now'))`,
    })
    .where(eq(recipes.id, id));

  revalidatePath("/");
  revalidatePath("/recipes");
  revalidatePath(`/recipes/${id}`);
  revalidatePath("/admin");

  return { success: true };
}

export async function deleteRecipe(id: number) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  await db.delete(recipes).where(eq(recipes.id, id));

  revalidatePath("/");
  revalidatePath("/recipes");
  revalidatePath("/admin");

  return { success: true };
}
