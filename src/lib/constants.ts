export const DEFAULT_CATEGORIES = [
  { name: "Cooking", slug: "cooking", color: "#FF9500", icon: "flame", sortOrder: 0 },
  { name: "Drinks", slug: "drinks", color: "#007AFF", icon: "wine", sortOrder: 1 },
  { name: "Desserts", slug: "desserts", color: "#FF2D55", icon: "cake", sortOrder: 2 },
] as const;

export const RECIPES_PER_PAGE = 12;

export const ADMIN_COOKIE_NAME = "recipe-admin-session";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
