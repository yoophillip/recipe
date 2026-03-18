import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { categories, recipes } from "./schema";

async function seed() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL || "file:local.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const db = drizzle(client);

  console.log("Seeding database...");

  // Create tables
  await client.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL DEFAULT '#6366f1',
      icon TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category_id INTEGER NOT NULL REFERENCES categories(id),
      tags TEXT NOT NULL DEFAULT '[]',
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL,
      prep_time INTEGER,
      cook_time INTEGER,
      servings INTEGER,
      image_url TEXT,
      is_featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Seed categories
  const categoryData = [
    { name: "Cooking", slug: "cooking", color: "#FF9500", icon: "flame", sortOrder: 0 },
    { name: "Drinks", slug: "drinks", color: "#007AFF", icon: "wine", sortOrder: 1 },
    { name: "Desserts", slug: "desserts", color: "#FF2D55", icon: "cake", sortOrder: 2 },
  ];

  for (const cat of categoryData) {
    await db.insert(categories).values(cat).onConflictDoNothing();
  }

  console.log("Categories seeded.");

  // Seed recipes
  const recipeData = [
    {
      title: "Classic Margherita Pizza",
      description: "A timeless Italian pizza with fresh mozzarella, tomatoes, and basil on a perfectly crispy thin crust.",
      categoryId: 1,
      tags:["italian", "vegetarian", "classic"],
      ingredients:[
        { item: "Pizza dough", amount: "1", unit: "ball" },
        { item: "San Marzano tomatoes", amount: "1", unit: "cup" },
        { item: "Fresh mozzarella", amount: "8", unit: "oz" },
        { item: "Fresh basil leaves", amount: "10", unit: "leaves" },
        { item: "Extra virgin olive oil", amount: "2", unit: "tbsp" },
        { item: "Sea salt", amount: "1", unit: "tsp" },
      ],
      instructions:[
        { step: 1, text: "Preheat your oven to 500°F (260°C) with a pizza stone inside for at least 30 minutes." },
        { step: 2, text: "Stretch the dough into a 12-inch round on a floured surface." },
        { step: 3, text: "Crush the tomatoes by hand and spread evenly over the dough, leaving a 1-inch border." },
        { step: 4, text: "Tear the mozzarella into pieces and distribute over the sauce." },
        { step: 5, text: "Slide onto the hot pizza stone and bake for 8-10 minutes until the crust is golden and cheese is bubbling." },
        { step: 6, text: "Remove from oven, top with fresh basil, drizzle with olive oil, and season with sea salt." },
      ],
      prepTime: 20,
      cookTime: 10,
      servings: 4,
      imageUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&q=80",
      isFeatured: true,
    },
    {
      title: "Thai Green Curry",
      description: "A fragrant and creamy coconut curry loaded with vegetables and aromatic Thai herbs.",
      categoryId: 1,
      tags:["thai", "spicy", "quick"],
      ingredients:[
        { item: "Green curry paste", amount: "3", unit: "tbsp" },
        { item: "Coconut milk", amount: "2", unit: "cans" },
        { item: "Chicken breast", amount: "1", unit: "lb" },
        { item: "Thai basil", amount: "1", unit: "cup" },
        { item: "Bamboo shoots", amount: "1", unit: "cup" },
        { item: "Fish sauce", amount: "2", unit: "tbsp" },
        { item: "Palm sugar", amount: "1", unit: "tbsp" },
        { item: "Thai eggplant", amount: "4", unit: "pieces" },
      ],
      instructions:[
        { step: 1, text: "Heat a tablespoon of coconut cream in a wok over high heat until it splits." },
        { step: 2, text: "Fry the green curry paste for 2 minutes until fragrant." },
        { step: 3, text: "Add sliced chicken and cook until sealed on all sides." },
        { step: 4, text: "Pour in the coconut milk and bring to a gentle simmer." },
        { step: 5, text: "Add eggplant and bamboo shoots, cook for 8 minutes." },
        { step: 6, text: "Season with fish sauce and palm sugar. Stir in Thai basil and serve over jasmine rice." },
      ],
      prepTime: 15,
      cookTime: 25,
      servings: 4,
      imageUrl: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80",
      isFeatured: true,
    },
    {
      title: "Garlic Butter Salmon",
      description: "Pan-seared salmon fillets basted in garlic herb butter — elegant enough for a dinner party, easy enough for a weeknight.",
      categoryId: 1,
      tags:["seafood", "quick", "keto"],
      ingredients:[
        { item: "Salmon fillets", amount: "4", unit: "pieces" },
        { item: "Butter", amount: "3", unit: "tbsp" },
        { item: "Garlic cloves, minced", amount: "4", unit: "cloves" },
        { item: "Lemon juice", amount: "2", unit: "tbsp" },
        { item: "Fresh thyme", amount: "4", unit: "sprigs" },
        { item: "Salt and pepper", amount: "to taste", unit: "" },
      ],
      instructions:[
        { step: 1, text: "Pat salmon fillets dry and season generously with salt and pepper." },
        { step: 2, text: "Heat olive oil in a large skillet over medium-high heat." },
        { step: 3, text: "Place salmon skin-side up and sear for 4 minutes until golden." },
        { step: 4, text: "Flip, add butter, garlic, and thyme to the pan." },
        { step: 5, text: "Baste the salmon with the garlic butter for 3-4 minutes." },
        { step: 6, text: "Squeeze lemon juice over the top and serve immediately." },
      ],
      prepTime: 5,
      cookTime: 10,
      servings: 4,
      imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
      isFeatured: false,
    },
    {
      title: "Mushroom Risotto",
      description: "Creamy Arborio rice cooked slowly with a medley of wild mushrooms, finished with Parmesan and truffle oil.",
      categoryId: 1,
      tags:["italian", "vegetarian", "comfort"],
      ingredients:[
        { item: "Arborio rice", amount: "1.5", unit: "cups" },
        { item: "Mixed mushrooms", amount: "12", unit: "oz" },
        { item: "Vegetable broth", amount: "6", unit: "cups" },
        { item: "White wine", amount: "0.5", unit: "cup" },
        { item: "Parmesan cheese", amount: "0.75", unit: "cup" },
        { item: "Shallots, diced", amount: "2", unit: "pieces" },
        { item: "Butter", amount: "3", unit: "tbsp" },
        { item: "Truffle oil", amount: "1", unit: "tsp" },
      ],
      instructions:[
        { step: 1, text: "Heat broth in a saucepan and keep warm over low heat." },
        { step: 2, text: "Sauté mushrooms in butter until golden, about 5 minutes. Set aside." },
        { step: 3, text: "Cook shallots in the same pan until soft. Add rice and toast for 2 minutes." },
        { step: 4, text: "Deglaze with white wine and stir until absorbed." },
        { step: 5, text: "Add warm broth one ladle at a time, stirring constantly, for about 18-20 minutes." },
        { step: 6, text: "Fold in mushrooms, Parmesan, and remaining butter. Drizzle with truffle oil to serve." },
      ],
      prepTime: 10,
      cookTime: 30,
      servings: 4,
      imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
      isFeatured: true,
    },
    {
      title: "Classic Mojito",
      description: "A refreshing Cuban cocktail with fresh mint, lime, rum, and soda water — the perfect warm-weather drink.",
      categoryId: 2,
      tags:["cocktail", "rum", "refreshing", "summer"],
      ingredients:[
        { item: "White rum", amount: "2", unit: "oz" },
        { item: "Fresh lime juice", amount: "1", unit: "oz" },
        { item: "Simple syrup", amount: "0.75", unit: "oz" },
        { item: "Fresh mint leaves", amount: "8", unit: "leaves" },
        { item: "Soda water", amount: "2", unit: "oz" },
        { item: "Ice", amount: "1", unit: "cup" },
      ],
      instructions:[
        { step: 1, text: "Gently muddle mint leaves with simple syrup in a glass — press, don't tear." },
        { step: 2, text: "Add fresh lime juice and white rum." },
        { step: 3, text: "Fill the glass with ice." },
        { step: 4, text: "Top with soda water and stir gently to combine." },
        { step: 5, text: "Garnish with a sprig of mint and a lime wheel." },
      ],
      prepTime: 5,
      cookTime: null,
      servings: 1,
      imageUrl: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80",
      isFeatured: true,
    },
    {
      title: "Espresso Martini",
      description: "A bold and sophisticated cocktail that combines fresh espresso with vodka and coffee liqueur.",
      categoryId: 2,
      tags:["cocktail", "coffee", "vodka", "party"],
      ingredients:[
        { item: "Vodka", amount: "2", unit: "oz" },
        { item: "Coffee liqueur", amount: "1", unit: "oz" },
        { item: "Fresh espresso", amount: "1", unit: "oz" },
        { item: "Simple syrup", amount: "0.5", unit: "oz" },
        { item: "Coffee beans", amount: "3", unit: "beans" },
      ],
      instructions:[
        { step: 1, text: "Brew a fresh shot of espresso and let it cool slightly." },
        { step: 2, text: "Add vodka, coffee liqueur, espresso, and simple syrup to a shaker with ice." },
        { step: 3, text: "Shake vigorously for 15 seconds — this creates the signature foam." },
        { step: 4, text: "Double strain into a chilled coupe glass." },
        { step: 5, text: "Garnish with three coffee beans in the center of the foam." },
      ],
      prepTime: 5,
      cookTime: null,
      servings: 1,
      imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c8c7f1b?w=800&q=80",
      isFeatured: false,
    },
    {
      title: "Matcha Latte",
      description: "A smooth and earthy Japanese matcha latte with silky steamed milk — naturally energizing.",
      categoryId: 2,
      tags:["tea", "japanese", "non-alcoholic", "healthy"],
      ingredients:[
        { item: "Ceremonial grade matcha", amount: "2", unit: "tsp" },
        { item: "Hot water (175°F)", amount: "2", unit: "oz" },
        { item: "Oat milk", amount: "8", unit: "oz" },
        { item: "Honey or simple syrup", amount: "1", unit: "tsp" },
      ],
      instructions:[
        { step: 1, text: "Sift the matcha powder into a bowl to remove clumps." },
        { step: 2, text: "Add hot water (not boiling) and whisk with a bamboo chasen until frothy." },
        { step: 3, text: "Steam or heat the oat milk until hot and frothy." },
        { step: 4, text: "Pour the matcha into a mug and add sweetener if desired." },
        { step: 5, text: "Slowly pour the steamed milk over the matcha." },
      ],
      prepTime: 5,
      cookTime: null,
      servings: 1,
      imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&q=80",
      isFeatured: false,
    },
    {
      title: "Classic Old Fashioned",
      description: "The quintessential bourbon cocktail — simple, spirit-forward, and timeless.",
      categoryId: 2,
      tags:["cocktail", "bourbon", "classic", "whiskey"],
      ingredients:[
        { item: "Bourbon whiskey", amount: "2", unit: "oz" },
        { item: "Sugar cube", amount: "1", unit: "piece" },
        { item: "Angostura bitters", amount: "3", unit: "dashes" },
        { item: "Orange peel", amount: "1", unit: "strip" },
        { item: "Luxardo cherry", amount: "1", unit: "piece" },
      ],
      instructions:[
        { step: 1, text: "Place the sugar cube in a rocks glass and saturate with bitters." },
        { step: 2, text: "Muddle until the sugar dissolves." },
        { step: 3, text: "Add bourbon and a large ice cube." },
        { step: 4, text: "Stir gently for 20-30 seconds." },
        { step: 5, text: "Express the orange peel over the glass and drop it in. Add the cherry." },
      ],
      prepTime: 5,
      cookTime: null,
      servings: 1,
      imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80",
      isFeatured: false,
    },
    {
      title: "New York Cheesecake",
      description: "Rich, dense, and impossibly creamy — this is the classic cheesecake done right with a graham cracker crust.",
      categoryId: 3,
      tags:["baking", "classic", "american"],
      ingredients:[
        { item: "Cream cheese", amount: "32", unit: "oz" },
        { item: "Sugar", amount: "1", unit: "cup" },
        { item: "Sour cream", amount: "1", unit: "cup" },
        { item: "Eggs", amount: "5", unit: "large" },
        { item: "Vanilla extract", amount: "2", unit: "tsp" },
        { item: "Graham cracker crumbs", amount: "2", unit: "cups" },
        { item: "Butter, melted", amount: "6", unit: "tbsp" },
        { item: "Lemon zest", amount: "1", unit: "tsp" },
      ],
      instructions:[
        { step: 1, text: "Preheat oven to 325°F. Mix graham cracker crumbs with melted butter and press into a 9-inch springform pan." },
        { step: 2, text: "Bake the crust for 10 minutes and let it cool." },
        { step: 3, text: "Beat cream cheese and sugar until completely smooth — no lumps." },
        { step: 4, text: "Add eggs one at a time, mixing on low speed between each." },
        { step: 5, text: "Fold in sour cream, vanilla, and lemon zest." },
        { step: 6, text: "Pour over the crust and bake in a water bath for 55-60 minutes." },
        { step: 7, text: "Turn off the oven, crack the door, and let the cheesecake cool inside for 1 hour." },
        { step: 8, text: "Refrigerate for at least 4 hours (overnight is best) before serving." },
      ],
      prepTime: 30,
      cookTime: 60,
      servings: 12,
      imageUrl: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&q=80",
      isFeatured: true,
    },
    {
      title: "Chocolate Lava Cake",
      description: "Individual molten chocolate cakes with a warm, gooey center — deceptively simple and always impressive.",
      categoryId: 3,
      tags:["chocolate", "baking", "quick", "fancy"],
      ingredients:[
        { item: "Dark chocolate (70%)", amount: "6", unit: "oz" },
        { item: "Butter", amount: "0.5", unit: "cup" },
        { item: "Eggs", amount: "2", unit: "large" },
        { item: "Egg yolks", amount: "2", unit: "large" },
        { item: "Sugar", amount: "0.25", unit: "cup" },
        { item: "Flour", amount: "2", unit: "tbsp" },
        { item: "Pinch of salt", amount: "1", unit: "pinch" },
      ],
      instructions:[
        { step: 1, text: "Preheat oven to 425°F. Butter and flour four 6-oz ramekins." },
        { step: 2, text: "Melt chocolate and butter together over a double boiler. Let cool slightly." },
        { step: 3, text: "Whisk eggs, yolks, and sugar until thick and pale." },
        { step: 4, text: "Fold the chocolate mixture into the eggs. Add flour and salt." },
        { step: 5, text: "Divide batter among ramekins and bake for exactly 12-13 minutes." },
        { step: 6, text: "Let rest for 1 minute, then invert onto plates. The center should be molten." },
      ],
      prepTime: 15,
      cookTime: 13,
      servings: 4,
      imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80",
      isFeatured: false,
    },
    {
      title: "Tiramisu",
      description: "Layers of espresso-soaked ladyfingers and mascarpone cream — the iconic Italian no-bake dessert.",
      categoryId: 3,
      tags:["italian", "coffee", "no-bake", "classic"],
      ingredients:[
        { item: "Mascarpone cheese", amount: "16", unit: "oz" },
        { item: "Heavy cream", amount: "1.5", unit: "cups" },
        { item: "Egg yolks", amount: "4", unit: "large" },
        { item: "Sugar", amount: "0.5", unit: "cup" },
        { item: "Strong espresso, cooled", amount: "1.5", unit: "cups" },
        { item: "Marsala wine", amount: "3", unit: "tbsp" },
        { item: "Ladyfinger cookies", amount: "24", unit: "pieces" },
        { item: "Cocoa powder", amount: "2", unit: "tbsp" },
      ],
      instructions:[
        { step: 1, text: "Whisk egg yolks and sugar over a double boiler until pale and thick. Let cool." },
        { step: 2, text: "Beat mascarpone into the egg mixture until smooth." },
        { step: 3, text: "Whip heavy cream to soft peaks and fold into the mascarpone mixture." },
        { step: 4, text: "Mix espresso with Marsala wine in a shallow dish." },
        { step: 5, text: "Quickly dip each ladyfinger in the espresso (don't soak) and layer in a 9x13 dish." },
        { step: 6, text: "Spread half the cream over the ladyfingers. Repeat layers." },
        { step: 7, text: "Dust generously with cocoa powder. Refrigerate for at least 6 hours." },
      ],
      prepTime: 30,
      cookTime: null,
      servings: 8,
      imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
      isFeatured: true,
    },
    {
      title: "Crème Brûlée",
      description: "Silky vanilla custard with a perfectly caramelized sugar crust — the ultimate French dessert.",
      categoryId: 3,
      tags:["french", "baking", "classic", "vanilla"],
      ingredients:[
        { item: "Heavy cream", amount: "2", unit: "cups" },
        { item: "Egg yolks", amount: "5", unit: "large" },
        { item: "Sugar", amount: "0.5", unit: "cup" },
        { item: "Vanilla bean", amount: "1", unit: "pod" },
        { item: "Sugar for brûlée", amount: "4", unit: "tsp" },
      ],
      instructions:[
        { step: 1, text: "Preheat oven to 325°F. Heat cream with vanilla bean seeds until just simmering." },
        { step: 2, text: "Whisk egg yolks and sugar until pale. Slowly temper in the hot cream." },
        { step: 3, text: "Strain through a fine sieve into four ramekins." },
        { step: 4, text: "Bake in a water bath for 40-45 minutes until set but still jiggly in the center." },
        { step: 5, text: "Chill for at least 4 hours." },
        { step: 6, text: "Sprinkle sugar evenly on top and torch until golden and crackling." },
      ],
      prepTime: 15,
      cookTime: 45,
      servings: 4,
      imageUrl: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=800&q=80",
      isFeatured: false,
    },
  ];

  for (const recipe of recipeData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.insert(recipes).values(recipe as any).onConflictDoNothing();
  }

  console.log(`Seeded ${recipeData.length} recipes.`);
  console.log("Done!");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
