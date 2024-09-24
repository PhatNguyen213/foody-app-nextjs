import Error from "@/app/meals/error";
import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import { uploadImage } from "./action";
// import fs from "node:fs";

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

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  // const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();
  const buffer = Buffer.from(bufferedImage);

  await uploadImage(fileName, buffer);

  meal.image = `${fileName}`;
  db.prepare(
    `
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
      VALUES (
        @title, 
        @summary, 
        @instructions, 
        @creator, 
        @creator_email, 
        @image, 
        @slug)
    `
  ).run(meal);
}
