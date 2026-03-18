import { z } from "zod";

export const ingredientSchema = z.object({
  item: z.string().min(1, "Item name is required"),
  amount: z.string().min(1, "Amount is required"),
  unit: z.string(),
});

export const instructionSchema = z.object({
  step: z.number().int().positive(),
  text: z.string().min(1, "Instruction text is required"),
});

export const createRecipeSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(1000),
  categoryId: z.number().int().positive("Category is required"),
  tags: z.array(z.string()).default([]),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
  instructions: z.array(instructionSchema).min(1, "At least one step is required"),
  prepTime: z.number().int().positive().nullable().optional(),
  cookTime: z.number().int().positive().nullable().optional(),
  servings: z.number().int().positive().nullable().optional(),
  imageUrl: z.string().url().nullable().optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
});

export const updateRecipeSchema = createRecipeSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
  icon: z.string().nullable().optional(),
});

export const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
