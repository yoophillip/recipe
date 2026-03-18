"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  defaultValue?: string;
  large?: boolean;
  className?: string;
}

export function SearchBar({ defaultValue = "", large, className }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <Search
        className={cn(
          "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground",
          large ? "h-5 w-5" : "h-4 w-4"
        )}
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search recipes..."
        className={cn(
          "w-full rounded-xl border border-border bg-background text-sm",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
          "transition-colors duration-150",
          large ? "h-14 pl-12 pr-4 text-base" : "h-10 pl-10 pr-4"
        )}
      />
    </form>
  );
}
