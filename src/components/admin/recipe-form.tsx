"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { createRecipe, updateRecipe } from "@/lib/actions/recipe-actions";
import type { Category, Recipe, Ingredient, Instruction } from "@/types";

interface RecipeFormProps {
  categories: Category[];
  recipe?: Recipe;
}

const emptyIngredient: Ingredient = { item: "", amount: "", unit: "" };
const emptyInstruction = (step: number): Instruction => ({ step, text: "" });

export function RecipeForm({ categories, recipe }: RecipeFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!recipe;

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(recipe?.title || "");
  const [description, setDescription] = useState(recipe?.description || "");
  const [categoryId, setCategoryId] = useState(String(recipe?.categoryId || ""));
  const [tags, setTags] = useState(recipe?.tags?.join(", ") || "");
  const [prepTime, setPrepTime] = useState(recipe?.prepTime?.toString() || "");
  const [cookTime, setCookTime] = useState(recipe?.cookTime?.toString() || "");
  const [servings, setServings] = useState(recipe?.servings?.toString() || "");
  const [imageUrl, setImageUrl] = useState(recipe?.imageUrl || "");
  const [isFeatured, setIsFeatured] = useState(recipe?.isFeatured || false);
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    recipe?.ingredients?.length ? recipe.ingredients : [{ ...emptyIngredient }]
  );
  const [instructions, setInstructions] = useState<Instruction[]>(
    recipe?.instructions?.length
      ? recipe.instructions
      : [emptyInstruction(1)]
  );

  const addIngredient = () => {
    setIngredients([...ingredients, { ...emptyIngredient }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, emptyInstruction(instructions.length + 1)]);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length === 1) return;
    const updated = instructions.filter((_, i) => i !== index);
    setInstructions(updated.map((inst, i) => ({ ...inst, step: i + 1 })));
  };

  const updateInstruction = (index: number, text: string) => {
    const updated = [...instructions];
    updated[index] = { ...updated[index], text };
    setInstructions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      title: title.trim(),
      description: description.trim(),
      categoryId: Number(categoryId),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      ingredients: ingredients.filter((i) => i.item.trim()),
      instructions: instructions
        .filter((i) => i.text.trim())
        .map((inst, idx) => ({ ...inst, step: idx + 1 })),
      prepTime: prepTime ? Number(prepTime) : null,
      cookTime: cookTime ? Number(cookTime) : null,
      servings: servings ? Number(servings) : null,
      imageUrl: imageUrl.trim() || null,
      isFeatured,
    };

    const result = isEditing
      ? await updateRecipe(recipe!.id, data)
      : await createRecipe(data);

    setLoading(false);

    if (result.error) {
      toast(result.error, "error");
    } else {
      toast(
        isEditing ? "Recipe updated!" : "Recipe created!",
        "success"
      );
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Basic Info</h2>
        <Input
          id="title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Classic Margherita Pizza"
          required
        />
        <Textarea
          id="description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief description of the recipe..."
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            id="category"
            label="Category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categories.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
            placeholder="Select category"
            required
          />
          <Input
            id="tags"
            label="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="italian, quick, vegan"
          />
        </div>
      </div>

      {/* Time & Servings */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Time & Servings</h2>
        <div className="grid grid-cols-3 gap-4">
          <Input
            id="prepTime"
            label="Prep (min)"
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            min={0}
          />
          <Input
            id="cookTime"
            label="Cook (min)"
            type="number"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            min={0}
          />
          <Input
            id="servings"
            label="Servings"
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            min={1}
          />
        </div>
      </div>

      {/* Image */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Image</h2>
        <Input
          id="imageUrl"
          label="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://images.unsplash.com/..."
        />
        {imageUrl && (
          <div className="rounded-xl overflow-hidden border border-border bg-muted h-48 relative">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Ingredients</h2>
        <div className="space-y-3">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="grid grid-cols-[1fr_80px_80px] gap-2 flex-1">
                <input
                  value={ing.item}
                  onChange={(e) => updateIngredient(i, "item", e.target.value)}
                  placeholder="Ingredient"
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  value={ing.amount}
                  onChange={(e) => updateIngredient(i, "amount", e.target.value)}
                  placeholder="Amt"
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  value={ing.unit}
                  onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                  placeholder="Unit"
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="button"
                onClick={() => removeIngredient(i)}
                className="rounded-lg p-2.5 hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                disabled={ingredients.length === 1}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={addIngredient}>
          <Plus className="h-4 w-4" />
          Add ingredient
        </Button>
      </div>

      {/* Instructions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Instructions</h2>
        <div className="space-y-3">
          {instructions.map((inst, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-sm font-semibold shrink-0">
                {inst.step}
              </span>
              <textarea
                value={inst.text}
                onChange={(e) => updateInstruction(i, e.target.value)}
                placeholder={`Step ${inst.step} instructions...`}
                rows={2}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
              <button
                type="button"
                onClick={() => removeInstruction(i)}
                className="rounded-lg p-2.5 hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                disabled={instructions.length === 1}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={addInstruction}>
          <Plus className="h-4 w-4" />
          Add step
        </Button>
      </div>

      {/* Featured */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="featured"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
        />
        <label htmlFor="featured" className="text-sm font-medium">
          Feature this recipe on the homepage
        </label>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <Button type="submit" loading={loading}>
          {isEditing ? "Save Changes" : "Create Recipe"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
