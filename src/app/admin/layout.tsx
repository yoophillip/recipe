import Link from "next/link";
import { ChefHat, LayoutDashboard, BookOpen, Tags, LogOut } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { adminLogout } from "@/lib/actions/auth-actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();

  // Allow login page without auth
  // The layout wraps all admin pages, but login is public
  // We'll check the path in a different way - just render children if not authed
  // The individual pages (except login) will handle their own redirects
  if (!authed) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-muted/30 hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2.5">
            <ChefHat className="h-6 w-6 text-primary" />
            <span className="font-semibold">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/recipes/new"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            New Recipe
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            <Tags className="h-4 w-4" />
            Categories
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <form action={adminLogout}>
            <button
              type="submit"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mt-1"
          >
            View site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-h-screen">
        {/* Mobile admin header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <Link href="/admin" className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">Admin</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/admin/recipes/new" className="text-primary font-medium">
              New
            </Link>
            <Link href="/" className="text-muted-foreground">
              Site
            </Link>
            <form action={adminLogout} className="inline">
              <button type="submit" className="text-muted-foreground">
                Out
              </button>
            </form>
          </div>
        </div>
        <div className="p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
