"use server";

import { redirect } from "next/navigation";
import { setAdminSession, clearAdminSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function adminLogin(
  prevState: { error: string } | null,
  formData: FormData
) {
  const result = loginSchema.safeParse({
    password: formData.get("password"),
  });

  if (!result.success) {
    return { error: "Password is required" };
  }

  if (result.data.password !== process.env.ADMIN_PASSWORD) {
    return { error: "Invalid password" };
  }

  await setAdminSession();
  redirect("/admin");
}

export async function adminLogout() {
  await clearAdminSession();
  redirect("/");
}
