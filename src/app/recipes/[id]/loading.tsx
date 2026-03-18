import { RecipeDetailSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-container px-4 sm:px-6 py-10">
      <div className="h-5 w-32 bg-muted rounded animate-pulse mb-8" />
      <RecipeDetailSkeleton />
    </div>
  );
}
