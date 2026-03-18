"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { deleteRecipe } from "@/lib/actions/recipe-actions";
import { useRouter } from "next/navigation";

interface DeleteRecipeButtonProps {
  recipeId: number;
  recipeName: string;
}

export function DeleteRecipeButton({ recipeId, recipeName }: DeleteRecipeButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteRecipe(recipeId);
    setLoading(false);

    if (result.error) {
      toast(result.error, "error");
    } else {
      toast("Recipe deleted", "success");
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} title="Delete Recipe">
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete <strong>{recipeName}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={loading}>
            Delete
          </Button>
        </div>
      </Dialog>
    </>
  );
}
