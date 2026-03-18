export interface Ingredient {
  item: string;
  amount: string;
  unit: string;
}

export interface Instruction {
  step: number;
  text: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
  icon: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  tags: string[];
  ingredients: Ingredient[];
  instructions: Instruction[];
  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;
  imageUrl: string | null;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeWithCategory extends Recipe {
  category: Category;
}
