import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_PROJECT_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const getRandomImage = async () => {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      max_results: 500,
    });

    if (!result.resources || result.resources.length === 0) {
      throw new Error("No images found in Cloudinary");
    }
    const randomImage =
      result.resources[Math.floor(Math.random() * result.resources.length)];
    return randomImage.secure_url;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
};
