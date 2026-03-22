/*
  Warnings:

  - The `itinerary` column on the `travel_guides` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "travel_guides"
ALTER COLUMN "itinerary"
TYPE JSONB
USING itinerary::jsonb;
