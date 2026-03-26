# 📸 Multiple Image & Video Upload System

## 🎯 Overview

এই system travel guide create করার সময় এ multiple images এবং videos upload support করে Cloudinary ব্যবহার করে।

---

## 📦 Implementation Summary

### **1. Multer Configuration** (`src/config/multer.ts`)

- ✅ Cloudinary storage setup
- ✅ Multiple file type support (images, videos)
- ✅ File size limits (100MB per file)
- ✅ MIME type validation
- ✅ Auto folder organization in Cloudinary
- ✅ Separate fields for images and videos

### **2. Route Setup** (`src/modules/Travel-Guides/travel-guide.route.ts`)

```typescript
// Multiple images & videos upload
router.post(
  "/",
  chackAuth(MemberRole.MEMBER),
  uploadGuideMedia, // Handles images & videos fields
  TravelGuideController.create,
);
```

### **3. Controller** (`src/modules/Travel-Guides/travel-guide.controller.ts`)

- ✅ File validation
- ✅ Media extraction from uploaded files
- ✅ JSON payload parsing
- ✅ Error handling

### **4. Utility Helper** (`src/utils/fileUploadHelper.ts`)

- ✅ `extractMediasFromFiles()` - Extract URLs from uploaded files
- ✅ `validateMedias()` - Validate upload limits
- ✅ `getFileCountSummary()` - Get upload statistics

### **5. Database** (Prisma Schema)

- ✅ `TravelGuide` - Main guide model
- ✅ `GuideMedia` - Media files with type (IMAGE/VIDEO)

---

## 🔧 Configuration Details

### **Cloudinary Folder Structure**

```
Travel-Guides/
├── images/
│   └── {unique-name}.jpg
├── videos/
│   └── {unique-name}.mp4
└── pdfs/
    └── {unique-name}.pdf
```

### **Multer Fields**

```
images: <max 10 files>
videos: <max 5 files>
```

### **File Types Allowed**

**Images:**

- JPEG, PNG, GIF, WebP

**Videos:**

- MP4, WebM, MOV, AVI

---

## 📝 API Request Format

### **Endpoint**

```
POST /api/v1/travel-guides
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

### **Form Data Parameters**

#### **Text Fields:**

```
title              (required, string)
description        (required, string)
categoryId         (required, string)
isPaid             (optional, boolean, default: false)
price              (optional, number)
status             (optional, enum: DRAFT|UNDER_REVIEW|APPROVED|REJECTED)
itinerary          (optional, JSON string)
```

#### **File Fields:**

```
images             (multiple files, max 10)
videos             (multiple files, max 5)
```

---

## 💾 Response Format

```json
{
  "success": true,
  "message": "Travel guide created successfully",
  "data": {
    "id": "guide-id",
    "title": "Guide Title",
    "guideMedia": [
      {
        "id": "media-id",
        "type": "IMAGE",
        "url": "https://res.cloudinary.com/.../image.jpg"
      },
      {
        "id": "media-id-2",
        "type": "VIDEO",
        "url": "https://res.cloudinary.com/.../video.mp4"
      }
    ]
  }
}
```

---

## 🧪 Testing with Postman

### **Step 1: Login & Get Token**

```
POST http://localhost:5000/api/auth/signin
{
  "email": "member@example.com",
  "password": "password123"
}
```

### **Step 2: Create Guide with Files**

```
POST http://localhost:5000/api/v1/travel-guides
Headers: Authorization: Bearer {token}
Body: form-data
```

**Form Data:**

```
title              = "Tokyo Guide"
description        = "Experience Tokyo..."
categoryId         = "cat-id-123"
isPaid             = true
price              = 49.99
itinerary          = [{"day":1,"title":"Day 1","activities":["Activity 1"]}]
images             = <select file 1>
images             = <select file 2>
videos             = <select file 1>
```

### **Step 3: Check Response**

- Look for `guideMedia` array
- Verify Cloudinary URLs
- Confirm media types (IMAGE/VIDEO)

---

## 🛠️ Clean Code Structure

```
travel-guide/
├── travel-guide.controller.ts    # Request handling with validation
├── travel-guide.service.ts       # Business logic & transactions
├── travel-guide.route.ts         # Route definitions with middleware
├── travel-guide.interface.ts     # Type definitions
└── travel-guide.validation.ts    # Zod schemas (optional)

config/
├── multer.ts                     # Multer storage setup
└── cloudinary.ts                 # Cloudinary config

utils/
└── fileUploadHelper.ts           # File processing utilities
```

### **Key Features:**

- ✅ Separation of concerns
- ✅ Reusable helper functions
- ✅ Type-safe with TypeScript
- ✅ Error handling at all levels
- ✅ Transaction support in DB
- ✅ Input validation

---

## 📊 Performance Optimizations

1. **Async File Uploads**: All files processed concurrently
2. **Database Transactions**: Atomic guide + media creation
3. **Cloudinary Async API**: Non-blocking upload process
4. **File Size Limits**: 100MB prevents excessive uploads
5. **Validation Before Upload**: Early error detection

---

## ⚠️ Error Handling

```javascript
// Missing files
"At least one image or video is required";

// Too many files
"Maximum 10 images allowed";
"Maximum 5 videos allowed";

// Invalid file type
"Invalid file type: {type}. Allowed: images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, MOV, AVI)";

// File size exceeded
"File size exceeds 100MB limit";
```

---

## 🚀 Production Deployment

### **Environment Variables**

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### **Cloudinary Setup**

1. Go to dashboard.cloudinary.com
2. Copy Cloud Name, API Key, API Secret
3. Add to `.env` file

### **Frontend Integration**

```javascript
const formData = new FormData();
formData.append("title", "My Guide");
formData.append("description", "Description...");
formData.append("categoryId", "cat-123");
formData.append("images", file1); // File input
formData.append("images", file2);
formData.append("videos", videoFile);

fetch("/api/v1/travel-guides", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

---

## 📚 File Reference

| File                                                   | Purpose                   |
| ------------------------------------------------------ | ------------------------- |
| `src/config/multer.ts`                                 | Multer & Cloudinary setup |
| `src/config/cloudinary.ts`                             | Cloudinary client         |
| `src/utils/fileUploadHelper.ts`                        | File processing helpers   |
| `src/modules/Travel-Guides/travel-guide.controller.ts` | Request handling          |
| `src/modules/Travel-Guides/travel-guide.route.ts`      | Route definitions         |
| `TRAVEL_GUIDE_UPLOAD_API_GUIDE.md`                     | Postman setup guide       |

---

## ✨ Key Improvements

✅ Multiple file upload support
✅ Automatic Cloudinary organization
✅ Comprehensive error handling
✅ Type-safe implementation
✅ Production-ready code
✅ Clean separation of concerns
✅ Performance optimized
✅ Well-documented

---

## 📞 Testing Checklist

- [ ] Single image upload works
- [ ] Multiple images upload works
- [ ] Mix of images and videos upload works
- [ ] Max file limits enforced
- [ ] Invalid file types rejected
- [ ] Cloudinary URLs returned in response
- [ ] Database records created properly
- [ ] Error messages clear and helpful

---

**Happy uploading! 🎉**
