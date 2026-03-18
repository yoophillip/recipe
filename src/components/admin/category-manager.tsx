"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { createCategory, deleteCategory } from "@/lib/actions/category-actions";
import type { Category } from "@/types";

interface CategoryWithCount extends Category {
  recipeCount: number;
}

interface CategoryManagerProps {
  categories: CategoryWithCount[];
}

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);

    const result = await createCategory({
      name: name.trim(),
      color,
      icon: null,
    });

    setLoading(false);
    if (result.error) {
      toast(result.error, "error");
    } else {
      toast("Category created!", "success");
      setName("");
      setColor("#6366f1");
      setShowAdd(false);
      router.refresh();
    }
  };

  const handleDelete = async (id: number) => {
    const result = await deleteCategory(id);
    if (result.error) {
      toast(result.error, "error");
    } else {
      toast("Category deleted", "success");
      router.refresh();
    }
  };

  return (
    <div>
      <div className="space-y-3 mb-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between p-4 rounded-xl border border-border"
          >
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-lg"
                style={{ backgroundColor: cat.color }}
              />
              <div>
                <p className="font-medium">{cat.name}</p>
                <p className="text-xs text-muted-foreground">
                  {cat.recipeCount} {cat.recipeCount === 1 ? "recipe" : "recipes"}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(cat.id)}
              className="rounded-lg p-2 hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
              title={cat.recipeCount > 0 ? "Cannot delete: has recipes" : "Delete category"}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <Button variant="secondary" onClick={() => setShowAdd(true)}>
        <Plus className="h-4 w-4" />
        Add Category
      </Button>

      <Dialog open={showAdd} onClose={() => setShowAdd(false)} title="New Category">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            id="cat-name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Snacks"
            required
            autoFocus
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-10 rounded-lg border border-border cursor-pointer"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
