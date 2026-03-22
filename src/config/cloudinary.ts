import { v2 as cloudinary } from "cloudinary";
import { envVeriables } from "./env";

cloudinary.config({
  cloud_name: envVeriables.CLOUDINARY_CLOUD_NAME,
  api_key: envVeriables.CLOUDINARY_API_KEY,
  api_secret: envVeriables.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = cloudinary;
