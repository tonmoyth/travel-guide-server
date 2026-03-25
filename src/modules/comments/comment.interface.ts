export type Comment = {
  id: string;
  guideId: string;
  memberId: string;
  parentId?: string | null;
  comment: string;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  replies?: Comment[];
  member?: {
    id: string;
    name: string;
    email?: string;
    role?: string;
  };
};

export type CreateCommentPayload = {
  guideId: string;
  comment: string;
  parentId?: string | null;
};

export type UpdateCommentPayload = {
  comment: string;
};
