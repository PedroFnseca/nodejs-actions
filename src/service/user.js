import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async (params) => {
  return await prisma.user.findMany({
    where: params,
  });
};

export const createUser = async (data) => {
  return await prisma.user.create({
    data,
  });
};

export const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id: parseInt(id) },
  });
};