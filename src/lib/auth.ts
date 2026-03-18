import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_MAX_AGE } from "./constants";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  return session?.value === "authenticated";
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
