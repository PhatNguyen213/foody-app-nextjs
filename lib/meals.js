import Error from "@/app/meals/error";
import sql from "better-sqlite3";

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  const meal = db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
  if (meal) meal.instructions = meal.instructions.replace(/\n/g, "<br />");
  return meal;
}
