/**
 * File Upload Helper Utility
 * Handles file processing and media extraction from Multer uploads
 */

export type MediaFile = {
  type: "IMAGE" | "VIDEO" | "PDF";
  url: string;
};

/**
 * Extract media files from Multer files object
 * @param files - Multer files object with images and videos arrays
 * @returns Array of media objects with type and URL
 */
export const extractMediasFromFiles = (
  files:
    | {
        images?: Express.Multer.File[];
        videos?: Express.Multer.File[];
        pdfs?: Express.Multer.File[];
      }
    | undefined,
): MediaFile[] => {
  const medias: MediaFile[] = [];

  if (!files) {
    return medias;
  }

  // Process images (support both array and single value just in case)
  const imageFiles =
    files.images && Array.isArray(files.images)
      ? files.images
      : files.images
        ? [files.images]
        : [];

  imageFiles.forEach((file) => {
    if (file) {
      medias.push({
        type: "IMAGE",
        url: (file as any).path,
      });
    }
  });

  // Process videos (support both array and single value just in case)
  const videoFiles =
    files.videos && Array.isArray(files.videos)
      ? files.videos
      : files.videos
        ? [files.videos]
        : [];

  videoFiles.forEach((file) => {
    if (file) {
      medias.push({
        type: "VIDEO",
        url: (file as any).path,
      });
    }
  });

  // Process PDFs (support both array and single value just in case)
  const pdfFiles =
    files.pdfs && Array.isArray(files.pdfs)
      ? files.pdfs
      : files.pdfs
        ? [files.pdfs]
        : [];

  pdfFiles.forEach((file) => {
    if (file) {
      medias.push({
        type: "PDF",
        url: (file as any).path,
      });
    }
  });

  return medias;
};

/**
 * Get file count summary
 */
export const getFileCountSummary = (
  files:
    | {
        images?: Express.Multer.File[];
        videos?: Express.Multer.File[];
        pdfs?: Express.Multer.File[];
      }
    | undefined,
): {
  imageCount: number;
  videoCount: number;
  pdfCount: number;
  totalCount: number;
} => {
  const imageCount = files?.images ? files.images.length : 0;
  const videoCount = files?.videos ? files.videos.length : 0;
  const pdfCount = files?.pdfs ? files.pdfs.length : 0;

  return {
    imageCount,
    videoCount,
    pdfCount,
    totalCount: imageCount + videoCount + pdfCount,
  };
};

/**
 * Validate required medias
 */
export const validateMedias = (
  files:
    | {
        images?: Express.Multer.File[];
        videos?: Express.Multer.File[];
        pdfs?: Express.Multer.File[];
      }
    | undefined,
): { isValid: boolean; message?: string } => {
  if (!files || (!files.images && !files.videos && !files.pdfs)) {
    return {
      isValid: false,
      message: "At least one image, video, or PDF is required",
    };
  }

  const imageCount = files.images ? files.images.length : 0;
  const videoCount = files.videos ? files.videos.length : 0;
  const pdfCount = files.pdfs ? files.pdfs.length : 0;

  if (imageCount > 10) {
    return {
      isValid: false,
      message: "Maximum 10 images allowed",
    };
  }

  if (videoCount > 5) {
    return {
      isValid: false,
      message: "Maximum 5 videos allowed",
    };
  }

  if (pdfCount > 5) {
    return {
      isValid: false,
      message: "Maximum 5 PDFs allowed",
    };
  }

  return { isValid: true };
};
