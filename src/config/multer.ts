import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary";

// Helper function to determine folder based on MIME type
const getFolder = (mimetype: string): string => {
  if (mimetype.startsWith("video")) {
    return "videos";
  } else if (mimetype.startsWith("image")) {
    return "images";
  } else if (mimetype === "application/pdf") {
    return "pdfs";
  }
  return "others";
};

// Determine resource type for Cloudinary
const getResourceType = (mimetype: string): "auto" | "image" | "video" => {
  if (mimetype.startsWith("video")) {
    return "video";
  } else if (mimetype.startsWith("image")) {
    return "image";
  }
  return "auto";
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLocaleLowerCase();

    const fileNameWithoutExtension = originalName
      .split(".")
      .slice(0, -1)
      .join(".")
      .toLowerCase()
      .replace(/\s+/g, "-")
      // eslint-disable-next-line no-useless-escape
      .replace(/[^a-z0-9\-]/g, "");

    const uniqueName =
      Math.random().toString(36).substring(2) +
      "-" +
      Date.now() +
      "-" +
      fileNameWithoutExtension;

    const folder = getFolder(file.mimetype);
    const resourceType = getResourceType(file.mimetype);

    return {
      folder: `Travel-Guides/${folder}`,
      public_id: uniqueName,
      resource_type: resourceType,
    };
  },
});

// File size & type filters
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Allowed image types
  const imageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  // Allowed video types
  const videoTypes = [
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",
  ];
  // Allowed PDF type
  const pdfTypes = ["application/pdf"];

  console.log(
    `File received: ${file.fieldname} - ${file.mimetype} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
  );

  if (
    imageTypes.includes(file.mimetype) ||
    videoTypes.includes(file.mimetype) ||
    pdfTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Allowed: images (JPEG, PNG, GIF, WebP), videos (MP4, WebM, MOV, AVI), and PDFs`,
      ),
    );
  }
};

// Multer upload instances
export const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
});

// Single image upload
export const uploadSingleImage = multerUpload.single("coverImage");

// Multiple images and videos upload
export const uploadGuideMedia = multerUpload.fields([
  { name: "images", maxCount: 10 }, // Maximum 10 images
  { name: "videos", maxCount: 5 }, // Maximum 5 videos
]);

// Upload guide media with optional cover image (for creation)
export const uploadGuideMediaWithCover = multerUpload.fields([
  { name: "images", maxCount: 10 }, // Maximum 10 images
  { name: "videos", maxCount: 5 }, // Maximum 5 videos
  { name: "pdfs", maxCount: 5 }, // Maximum 5 PDFs
  { name: "coverImage", maxCount: 1 }, // Optional cover image
]);
