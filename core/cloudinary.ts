import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const cloudinary_client = cloudinary.config({
  cloud_name: process.env.CLOUDINARY_PROJECT_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
