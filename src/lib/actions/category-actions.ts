"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { categories, recipes } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";
import { createCategorySchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";
import type { CreateCategoryInput } from "@/lib/validators";

export async function createCategory(input: CreateCategoryInput) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  const result = createCategorySchema.safeParse(input);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const slug = slugify(result.data.name);

  await db.insert(categories).values({
    name: result.data.name,
    slug,
    color: result.data.color,
    icon: result.data.icon ?? null,
    sortOrder: 99,
  });

  revalidatePath("/");
  revalidatePath("/admin/categories");

  return { success: true };
}

export async function deleteCategory(id: number) {
  const authed = await isAuthenticated();
  if (!authed) return { error: "Unauthorized" };

  // Check for recipes using this category
  const recipeCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(recipes)
    .where(eq(recipes.categoryId, id));

  if (recipeCount[0].count > 0) {
    return { error: "Cannot delete category with existing recipes. Move or delete them first." };
  }

  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath("/");
  revalidatePath("/admin/categories");

  return { success: true };
}
