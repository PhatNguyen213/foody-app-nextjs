"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY;
const STORAGE_ACCOUNT_NAME = process.env.STORAGE_ACCOUNT_NAME;
const CONTAINER_NAME = process.env.CONTAINER_NAME;

console.log(STORAGE_ACCESS_KEY);

function createBlobService() {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    STORAGE_ACCOUNT_NAME,
    STORAGE_ACCESS_KEY
  );
  const blobService = new BlobServiceClient(
    `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    sharedKeyCredential
  );
  return blobService;
}

export async function uploadImage(name, image) {
  const blobService = createBlobService();
  const containerClient = blobService.getContainerClient(CONTAINER_NAME);
  const blobClient = containerClient.getBlockBlobClient(name);
  return blobClient.uploadData(image);
}

function isInvalidText(text) {
  return !text || text.trim() === "";
}

export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    return {
      message: "Invalid input",
    };
  }

  await saveMeal(meal);
  revalidatePath("/meals");
  redirect("/meals");
}
