# 🚀 Quick Start Guide - Multiple File Upload

## ⚡ 5 Minute Setup

### **1. Server Running?**

```bash
npm run dev
```

### **2. Get Login Token**

```
POST http://localhost:5000/api/auth/signin
Content-Type: application/json

{
  "email": "member@example.com",
  "password": "password123"
}
```

✅ Copy the `accessToken` from response

---

## 🎬 Postman Setup (Simple Version)

### **Create Travel Guide**

```
Method: POST
URL: http://localhost:5000/api/v1/travel-guides
```

### **Authorization Tab:**

- Type: Bearer Token
- Token: `{paste your accessToken here}`

### **Body Tab - form-data:**

**Add These Text Fields:**

| Key         | Value                                                                   |
| ----------- | ----------------------------------------------------------------------- |
| title       | Tokyo Adventure 2025                                                    |
| description | Experience the magic of Tokyo through local eyes                        |
| categoryId  | paste-actual-category-id                                                |
| isPaid      | true                                                                    |
| price       | 99.99                                                                   |
| status      | DRAFT                                                                   |
| itinerary   | [{"day":1,"title":"Arrival","activities":["Airport","Hotel check-in"]}] |

**Add These File Fields:**

| Key    | Select File | Note           |
| ------ | ----------- | -------------- |
| images | image1.jpg  | Any .jpg/.png  |
| images | image2.jpg  | Multiple ok    |
| videos | video1.mp4  | Any .mp4/.webm |

### **Send & Check Response**

✅ You should see all media URLs in `guideMedia` array

---

## 📋 Demo Data (Just Copy Paste!)

### **Minimal (Quick Test)**

**Form-data:**

```
title = London Guide
description = Explore London like a local
categoryId = {get-from-/api/v1/categories}
isPaid = false
status = DRAFT
images = select any .jpg file
```

### **Complete (Full Demo)**

**Form-data:**

```
title = Paris Complete Experience 2025
description = 5-day comprehensive tour of Paris including Eiffel Tower, Louvre, and local cuisine experiences. Perfect for first-time visitors and culture enthusiasts.
categoryId = {get-from-/api/v1/categories}
isPaid = true
price = 149.99
status = DRAFT
itinerary = [{"day":1,"title":"Paris Arrival","activities":["Land at Charles de Gaulle","Get to hotel","Explore neighborhood"]},{"day":2,"title":"Museums Day","activities":["Visit Louvre","Lunch at café","Montmartre walk"]},{"day":3,"title":"Iconic Sites","activities":["Eiffel Tower","Seine River Cruise","Dinner at French restaurant"]}]

images = file1.jpg
images = file2.jpg
images = file3.jpg
images = file4.jpg
videos = video1.mp4
videos = video2.mp4
```

---

## 🔑 Get Valid Category ID

```
GET http://localhost:5000/api/v1/categories
Authorization: Bearer {token}
```

Response will show categories. Copy any `id` and use in `categoryId` field.

---

## ✅ Success Checklist

After sending request, response should have:

```json
{
  "success": true,
  "data": {
    "id": "some-id",
    "title": "your-title",
    "guideMedia": [
      {
        "id": "media-1",
        "type": "IMAGE",
        "url": "https://res.cloudinary.com/...",
        "..."
      }
    ]
  }
}
```

✅ Check:

- [ ] `success: true`
- [ ] `guideMedia` array not empty
- [ ] All files have Cloudinary URLs
- [ ] Media types correct (IMAGE/VIDEO)

---

## ⚠️ Common Issues

### Issue: "At least one image or video is required"

- ✅ Make sure you added files in form-data
- ✅ Check that Key type is set to "File" (not "Text")

### Issue: "Missing Stripe signature" after uploading

- ✅ This is unrelated to this feature
- ✅ Just close that error and check the 200 response from GET/POST

### Issue: Category not found

- ✅ First call `GET /api/v1/categories` to get actual IDs
- ✅ Use real category IDs, not random strings

### Issue: Files not selecting

- ✅ In Postman form-data, click the file icon on the right
- ✅ Select files from your computer
- ✅ Don't paste file paths as text

---

## 📊 Max Limits

| Item             | Limit                |
| ---------------- | -------------------- |
| Images per guide | 10                   |
| Videos per guide | 5                    |
| Max file size    | 100 MB               |
| Image types      | JPEG, PNG, GIF, WebP |
| Video types      | MP4, WebM, MOV, AVI  |

---

## 🎯 What's Actually Working

✅ Multiple image uploads to Cloudinary
✅ Multiple video uploads to Cloudinary  
✅ Automatic folder organization
✅ Clean database records
✅ Type-safe code
✅ Full error handling
✅ Transaction support

---

## 📝 Next Steps

After testing:

1. Create frontend form with file inputs
2. Use `FormData` API to send
3. Show upload progress
4. Display media in guide view

---

**That's it! Now go test! 🎉**
