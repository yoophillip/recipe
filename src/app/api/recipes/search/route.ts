import { NextRequest, NextResponse } from "next/server";
import { searchRecipes, getRecipesByIds } from "@/lib/queries/recipes";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const ids = searchParams.getAll("ids").map(Number).filter(Boolean);

  if (ids.length > 0) {
    const recipes = await getRecipesByIds(ids);
    return NextResponse.json(recipes);
  }

  if (query) {
    const results = await searchRecipes(query);
    return NextResponse.json(results);
  }

  return NextResponse.json([]);
}
