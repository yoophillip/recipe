import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types";

interface CategoryBadgeProps {
  category: Category;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return <Badge color={category.color}>{category.name}</Badge>;
}
