import { TravelGuide } from "../../../prisma/generated/prisma/browser";

const getAll = async (): Promise<TravelGuide[]> => {
  return [];
};

const getById = async (id: string): Promise<TravelGuide | null> => {
  return null;
};

const create = async (data: Partial<TravelGuide>): Promise<TravelGuide> => {
  return {
    id: "",
    title: "",
    description: "",
    location: "",
    ...data,
  } as TravelGuide;
};

const update = async (
  id: string,
  data: Partial<TravelGuide>,
): Promise<TravelGuide | null> => {
  return {
    id,
    title: "",
    description: "",
    location: "",
    ...data,
  } as TravelGuide;
};

const remove = async (id: string): Promise<void> => {
  return;
};

export const TravelGuideService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
