import { db } from "@/db";
import { recipes, categories } from "@/db/schema";
import { eq, desc, like, or, sql, inArray } from "drizzle-orm";
import type { RecipeWithCategory, Ingredient, Instruction } from "@/types";

function parseJson<T>(value: T | string): T {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value as T;
    }
  }
  return value;
}

function normalizeRecipe(r: { recipes: typeof recipes.$inferSelect; categories: typeof categories.$inferSelect | null }): RecipeWithCategory {
  return {
    ...r.recipes,
    tags: parseJson<string[]>(r.recipes.tags),
    ingredients: parseJson<Ingredient[]>(r.recipes.ingredients),
    instructions: parseJson<Instruction[]>(r.recipes.instructions),
    isFeatured: Boolean(r.recipes.isFeatured),
    category: r.categories!,
  } as RecipeWithCategory;
}

export async function getRecipes(options?: {
  categoryId?: number;
  limit?: number;
  offset?: number;
}): Promise<RecipeWithCategory[]> {
  const { categoryId, limit = 50, offset = 0 } = options || {};

  const conditions = categoryId ? eq(recipes.categoryId, categoryId) : undefined;

  const results = await db
    .select()
    .from(recipes)
    .leftJoin(categories, eq(recipes.categoryId, categories.id))
    .where(conditions)
    .orderBy(desc(recipes.createdAt))
    .limit(limit)
    .offset(offset);

  return results.map(normalizeRecipe);
}

export async function getRecipeById(id: number): Promise<RecipeWithCategory | null> {
  const results = await db
    .select()
    .from(recipes)
    .leftJoin(categories, eq(recipes.categoryId, categories.id))
    .where(eq(recipes.id, id))
    .limit(1);

  if (!results[0]) return null;

  return normalizeRecipe(results[0]);
}

export async function searchRecipes(query: string): Promise<RecipeWithCategory[]> {
  const searchTerm = `%${query}%`;

  const results = await db
    .select()
    .from(recipes)
    .leftJoin(categories, eq(recipes.categoryId, categories.id))
    .where(
      or(
        like(recipes.title, searchTerm),
        like(recipes.description, searchTerm),
        like(recipes.tags, searchTerm)
      )
    )
    .orderBy(desc(recipes.createdAt))
    .limit(50);

  return results.map(normalizeRecipe);
}

export async function getFeaturedRecipes(): Promise<RecipeWithCategory[]> {
  const results = await db
    .select()
    .from(recipes)
    .leftJoin(categories, eq(recipes.categoryId, categories.id))
    .where(eq(recipes.isFeatured, true))
    .orderBy(desc(recipes.createdAt))
    .limit(6);

  return results.map(normalizeRecipe);
}

export async function getRecentRecipes(limit = 6): Promise<RecipeWithCategory[]> {
  const results = await db
    .select()
    .from(recipes)
    .leftJoin(categories, eq(recipes.categoryId, categories.id))
    .orderBy(desc(recipes.createdAt))
    .limit(limit);

  return results.map(normalizeRecipe);
}

export async function getRecipesByIds(ids: number[]): Promise<RecipeWithCategory[]> {
  if (ids.length === 0) return [];

  const results = await db
    .select()
    .from(recipes)
    .leftJoin(categories, eq(recipes.categoryId, categories.id))
    .where(inArray(recipes.id, ids));

  return results.map(normalizeRecipe);
}

export async function getRecipeCount(categoryId?: number): Promise<number> {
  const conditions = categoryId ? eq(recipes.categoryId, categoryId) : undefined;
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(recipes)
    .where(conditions);
  return result[0].count;
}
