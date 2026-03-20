export type Category = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  guides?: any[]; // Relation to TravelGuide
};
