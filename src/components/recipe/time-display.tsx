import { Clock, Flame, Users } from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface TimeDisplayProps {
  prepTime?: number | null;
  cookTime?: number | null;
  servings?: number | null;
}

export function TimeDisplay({ prepTime, cookTime, servings }: TimeDisplayProps) {
  const items = [
    prepTime && { icon: Clock, label: "Prep", value: formatDuration(prepTime) },
    cookTime && { icon: Flame, label: "Cook", value: formatDuration(cookTime) },
    servings && { icon: Users, label: "Serves", value: `${servings}` },
  ].filter(Boolean) as { icon: typeof Clock; label: string; value: string }[];

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <item.icon className="h-4 w-4" />
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
