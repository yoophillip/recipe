import { ChefHat } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-container px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ChefHat className="h-5 w-5" />
            <span className="text-sm">Recipe Collection</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Made with care for great food and drinks.
          </p>
        </div>
      </div>
    </footer>
  );
}
