# 🚀 Travel Guide Multiple Upload System - Postman Guide

## 📋 Endpoints Overview

### 1️⃣ **Create Travel Guide with Multiple Images & Videos**

```
POST /api/v1/travel-guides
Authorization: Bearer {your_access_token}
Content-Type: multipart/form-data
```

---

## 🎯 Step-by-Step Postman Setup

### **STEP 1: Create New Request**

```
Method: POST
URL: http://localhost:5000/api/v1/travel-guides
```

### **STEP 2: Set Authorization**

- Select **Authorization** tab
- Type: Bearer Token
- Token: `{your_access_token}` (from login response)

### **STEP 3: Prepare Form Data in Body Tab**

- Select: **Body** → **form-data**

---

## 📝 Form Fields to Add

### **Text Fields:**

| Key         | Value                                                                                     | Type |
| ----------- | ----------------------------------------------------------------------------------------- | ---- |
| title       | "Paris: City of Lights Adventure"                                                         | Text |
| description | "Explore the most romantic city in the world with local insights"                         | Text |
| categoryId  | "actual-category-id-from-db"                                                              | Text |
| isPaid      | true                                                                                      | Text |
| price       | 49.99                                                                                     | Text |
| status      | DRAFT                                                                                     | Text |
| itinerary   | `[{"day":1,"title":"Arrival","activities":["Airport pickup","Hotel check-in","Dinner"]}]` | Text |

### **File Fields (Images):**

| Key    | File                 | Type |
| ------ | -------------------- | ---- |
| images | `select_image_1.jpg` | File |
| images | `select_image_2.jpg` | File |
| images | `select_image_3.jpg` | File |

### **File Fields (Videos):**

| Key    | File                 | Type |
| ------ | -------------------- | ---- |
| videos | `select_video_1.mp4` | File |
| videos | `select_video_2.mp4` | File |

---

## 💡 Demo Data (Copy-Paste Ready)

### **Option 1: Minimal Setup (1 Image)**

**Body Form-Data:**

```
title: "Bali Beach Paradise"
description: "Discover the beautiful beaches and culture of Bali"
categoryId: "{{insert-real-category-id}}"
isPaid: false
status: DRAFT
itinerary: [{"day":1,"title":"Beach Day","activities":["Swimming","Surfing","Sunset watching"]}]
images: <select any .jpg or .png file>
```

---

### **Option 2: Complete Setup (Multiple Images & Videos)**

**Body Form-Data:**

```
title: "Complete Japan Tour"
description: "Experience the blend of ancient traditions and modern technology in Japan. This 7-day tour covers Tokyo, Kyoto, and Osaka with guided experiences and local cuisine."
categoryId: "{{insert-real-category-id}}"
isPaid: true
price: 99.99
status: DRAFT
itinerary: [
  {
    "day": 1,
    "title": "Tokyo Arrival",
    "activities": ["Arrive at Narita Airport", "Check-in at Shibuya hotel", "Explore Shibuya Crossing"]
  },
  {
    "day": 2,
    "title": "Tokyo Exploration",
    "activities": ["Visit Senso-ji Temple", "Lunch at Tsukiji Market", "Shibuya Crossing at night"]
  },
  {
    "day": 3,
    "title": "Kyoto Journey",
    "activities": ["Take bullet train to Kyoto", "Visit Fushimi Inari Shrine", "Walk through bamboo forest"]
  },
  {
    "day": 4,
    "title": "Osaka Adventure",
    "activities": ["Visit Osaka Castle", "Dotonbori food street", "Stay overnight in Osaka"]
  },
  {
    "day": 5,
    "title": "Mount Fuji",
    "activities": ["Day trip to Mount Fuji", "Visit Hakone", "Onsen experience"]
  }
]

images: <file_1.jpg>
images: <file_2.jpg>
images: <file_3.jpg>
images: <file_4.jpg>

videos: <video_1.mp4>
videos: <video_2.mp4>
```

---

## 🎬 Example Response (Success)

```json
{
  "success": true,
  "message": "Travel guide created successfully",
  "data": {
    "id": "clv5x9z8k0000qz0h8q9d0x9d",
    "memberId": "user-id-123",
    "categoryId": "category-id-456",
    "title": "Paris: City of Lights Adventure",
    "description": "Explore the most romantic city in the world with local insights",
    "itinerary": "[{\"day\":1,\"title\":\"Arrival\",\"activities\":[\"Airport pickup\",\"Hotel check-in\",\"Dinner\"]}]",
    "status": "DRAFT",
    "isPaid": true,
    "price": 49.99,
    "coverImage": null,
    "isDeleted": false,
    "createdAt": "2025-03-26T12:30:00Z",
    "updatedAt": "2025-03-26T12:30:00Z",
    "guideMedia": [
      {
        "id": "media-1",
        "guideId": "clv5x9z8k0000qz0h8q9d0x9d",
        "type": "IMAGE",
        "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/Travel-Guides/images/image-1.jpg",
        "createdAt": "2025-03-26T12:30:00Z",
        "updatedAt": "2025-03-26T12:30:00Z"
      },
      {
        "id": "media-2",
        "guideId": "clv5x9z8k0000qz0h8q9d0x9d",
        "type": "IMAGE",
        "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/Travel-Guides/images/image-2.jpg",
        "createdAt": "2025-03-26T12:30:00Z",
        "updatedAt": "2025-03-26T12:30:00Z"
      },
      {
        "id": "media-3",
        "guideId": "clv5x9z8k0000qz0h8q9d0x9d",
        "type": "VIDEO",
        "url": "https://res.cloudinary.com/your-cloud/video/upload/v1234567890/Travel-Guides/videos/video-1.mp4",
        "createdAt": "2025-03-26T12:30:00Z",
        "updatedAt": "2025-03-26T12:30:00Z"
      }
    ]
  }
}
```

---

## ⚠️ File Upload Limits

| Constraint    | Limit                |
| ------------- | -------------------- |
| Max Images    | 10                   |
| Max Videos    | 5                    |
| File Size     | 100MB per file       |
| Image Formats | JPEG, PNG, GIF, WebP |
| Video Formats | MP4, WebM, MOV, AVI  |

---

## 🔍 Postman Form-Data Troubleshooting

### **Problem: Media not uploading**

✅ **Solution:**

- Make sure you selected `form-data` in Body tab (not JSON)
- Set Key type to `File` for file uploads
- Set Key type to `Text` for text fields

### **Problem: itinerary shows as string instead of object**

✅ **Solution:**

- Set itinerary as **Text** type in form-data
- Use proper JSON format: `[{"day":1,"title":"Day 1","activities":["Activity 1"]}]`

### **Problem: CategoryId not found**

✅ **Solution:**

- First, get valid categories using: `GET /api/v1/categories`
- Copy a valid category ID from the response
- Use that in the form-data

---

## 📤 How to Test Locally

### **1. Start Server**

```bash
npm run dev
```

### **2. Get Login Token**

```
POST http://localhost:5000/api/auth/signin
{
  "email": "member@example.com",
  "password": "password123"
}
```

Copy the `accessToken` from response

### **3. Set Up Postman Collection**

- Import this endpoint setup
- Set Bearer token in Authorization
- Add Environment variable: `base_url = http://localhost:5000`

### **4. Upload Travel Guide**

- Prepare images/videos
- Fill form-data fields
- Send POST request
- Check response for media URLs in Cloudinary

---

## 🎨 Sample Itinerary JSON

```json
[
  {
    "day": 1,
    "title": "Arrival & Hotel Check-in",
    "activities": [
      "Arrive at airport",
      "Taxi/Bus to hotel",
      "Check-in and rest",
      "Evening walk around hotel"
    ]
  },
  {
    "day": 2,
    "title": "City Tour",
    "activities": [
      "Breakfast at hotel",
      "Visit main attractions",
      "Lunch at local restaurant",
      "Shopping at markets",
      "Dinner cruise"
    ]
  },
  {
    "day": 3,
    "title": "Adventure Activities",
    "activities": [
      "Mountain hiking",
      "Picnic lunch",
      "Photography session",
      "Sunset watching"
    ]
  }
]
```

---

## ✨ Pro Tips

✅ Use descriptive file names for better organization
✅ Compress large images before uploading
✅ Test with 1 image first, then add more
✅ Set `isPaid: false` for testing initially
✅ Use `status: DRAFT` to save without publishing
✅ Keep itinerary JSON formatted properly

---

**Ready to upload? Happy travels! 🌍**
