import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getCategories() {
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getCategoryBySlug(slug: string) {
  const results = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return results[0] || null;
}

export async function getCategoryById(id: number) {
  const results = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  return results[0] || null;
}
