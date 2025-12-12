import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_PROJECT_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

let cachedImages: any[] = [];
let lastCacheTime = 0;

export const getRandomCachedImage = async () => {
  console.log(Date.now());
  if (Date.now() - lastCacheTime > 3600000) {
    try {
      console.log("fetching from cloudinary");
      const result = await cloudinary.api.resources({
        type: "upload",
        max_results: 500,
        tags: true,
      });

      if (!result.resources || result.resources.length === 0) {
        throw new Error("No images found in Cloudinary");
      }

      cachedImages = result.resources;
      lastCacheTime = Date.now();
    } catch (error) {
      console.error("Error fetching image:", error);
      throw error;
    }
  }

  console.log("fetching from cache");
  const randomImage =
    cachedImages[Math.floor(Math.random() * cachedImages.length)];
  console.log(randomImage);
  return randomImage.secure_url;
};
