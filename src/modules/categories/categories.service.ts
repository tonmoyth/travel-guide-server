import { Category } from "../../../prisma/generated/prisma/browser";
import { prisma } from "../../lib/prisma";

const getAll = async (): Promise<Category[]> => {
  return await prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
  });
};

const getById = async (id: string): Promise<Category | null> => {
  return await prisma.category.findFirst({
    where: { id, isDeleted: false },
  });
};

const create = async (
  data: Omit<
    Category,
    "id" | "createdAt" | "updatedAt" | "isDeleted" | "deletedAt" | "guides"
  >,
): Promise<Category> => {
  return await prisma.category.create({
    data,
  });
};

const update = async (
  id: string,
  data: Partial<
    Omit<
      Category,
      "id" | "createdAt" | "updatedAt" | "isDeleted" | "deletedAt" | "guides"
    >
  >,
): Promise<Category | null> => {
  return await prisma.category.update({
    where: { id },
    data,
  });
};

const remove = async (id: string): Promise<void> => {
  await prisma.category.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};

export const CategoryService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
