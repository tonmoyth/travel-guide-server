# TravelGuide Hub - Backend

## Project Overview

TravelGuide Hub is an online community portal where users can share travel guides, destination tips, itineraries, and travel experiences. This backend API serves the platform, handling user authentication, guide management, voting, commenting, and administrative functions.

## Features

- **User Authentication**: JWT-based authentication with email/password signup and login
- **User Roles**: Members, Paid Guides, and Admins with different permissions
- **Guide Management**: Create, edit, delete, and approve/reject travel guides
- **Categories**: Predefined categories like Adventure, Culture, Food, Budget Travel, Nature, City Guides
- **Voting System**: Upvote/downvote guides with one vote per user
- **Commenting**: Nested comment system for discussions
- **Search and Filter**: Search guides by title, destination, or keywords; filter by category, payment type, etc.
- **Payment Integration**: Stripe for purchasing access to paid guides
- **Admin Panel**: Approve/reject guides, manage users, delete inappropriate content

## Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Payment**: Stripe
- **Deployment**: Vercel

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/tonmoyth/travel-guide-server.git
   cd travel_guide_server
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   PORT
   FRONTEND_URL
   DATABASE_URL
   BETTER_AUTH_SECRET
   BETTER_AUTH_URL
   JWT_SECRET_KEY
   JWT_EXPIRES_IN
   JWT_REFRESH_SECRET_KEY
   JWT_REFRESH_EXPIRES_IN
   GOOGLE_CLIENT_ID
   GOOGLE_CLIENT_SECRET
   GOOGLE_REDIRECT_URI
   GOOGLE_FRONTEND_URL
   CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET
   STRIPE_SECRET_KEY
   STRIPE_WEBHOOK_SECRET
   EMAIL_SENDER_SMTP_USER
   EMAIL_SENDER_SMTP_PASS
   EMAIL_SENDER_SMTP_HOST
   EMAIL_SENDER_SMTP_PORT
   EMAIL_SENDER_FROM
   # Add other required environment variables
   ```

4. Set up the database:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Seed the database (if applicable):
   ```bash
   npm run seed
   ```

## Running the Server

1. Start the development server:

   ```bash
   npm run dev
   ```

2. The server will run on `http://localhost:3000` (or your configured port).
