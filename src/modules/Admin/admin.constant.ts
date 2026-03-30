export const AdminConstants = {
  defaultPageSize: 10,
};

export const MemberSearchableFields = ["name", "email", "bio"];

export const MemberFilterableFields = [
  "role",
  "gender",
  "status",
  "emailVerified",
  "isDeleted",
  "createdAt",
  "updatedAt",
];

export const TravelGuideSearchableFields = ["title", "description"];

export const TravelGuideFilterableFields = [
  "status",
  "price",
  "categoryId",
  "isPaid",
  "isDeleted",
  "memberId",
  "createdAt",
  "updatedAt",
];
