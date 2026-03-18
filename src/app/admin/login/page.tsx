"use client";

import { useFormState } from "react-dom";
import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminLogin } from "@/lib/actions/auth-actions";

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(adminLogin, null);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-2xl bg-primary/10 p-3">
              <ChefHat className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your password to manage recipes.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Enter admin password"
            error={state && "error" in state ? state.error : undefined}
            autoFocus
          />
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
