import { Category, Prisma } from "../../../prisma/generated/prisma/browser";
import { IQueryParams } from "../../interface/queryBuilder.interface";
import { prisma } from "../../lib/prisma";
import { QueryBuilder } from "../../utils/queryBuilder";
import { FilterableFields, SearchableFields } from "./categories.constant";

const getAll = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    Category,
    Prisma.CategoryWhereInput,
    Prisma.CategoryInclude
  >(prisma.category, query, {
    searchableFields: SearchableFields,
    filterableFields: FilterableFields,
  });

  queryBuilder.where({ isDeleted: false });

  const results = await queryBuilder
    .search()
    .filter()
    .include({ guides: true })
    .paginate()
    .sort()
    .fields()
    .execute();

  return results;

  // return await prisma.category.findMany({
  //   where: { isDeleted: false },
  //   orderBy: { createdAt: "desc" },
  // });
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
