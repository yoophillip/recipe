import { RecipeGridSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-container px-4 sm:px-6 py-10">
      <div className="h-5 w-24 bg-muted rounded animate-pulse mb-6" />
      <div className="mb-8 space-y-2">
        <div className="h-9 w-40 bg-muted rounded-lg animate-pulse" />
        <div className="h-5 w-20 bg-muted rounded animate-pulse" />
      </div>
      <RecipeGridSkeleton count={6} />
    </div>
  );
}
