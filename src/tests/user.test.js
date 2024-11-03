import { PrismaClient } from '@prisma/client';
import { getUsers, createUser, updateUser, deleteUser } from '../service/user.js';

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return users based on params', async () => {
      const params = { name: 'John' };
      const users = [{ id: 1, name: 'John' }];
      prisma.user.findMany.mockResolvedValue(users);

      const result = await getUsers(params);

      expect(prisma.user.findMany).toHaveBeenCalledWith({ where: params });
      expect(result).toEqual(users);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const data = { name: 'John' };
      const user = { id: 1, name: 'John' };
      prisma.user.create.mockResolvedValue(user);

      const result = await createUser(data);

      expect(prisma.user.create).toHaveBeenCalledWith({ data });
      expect(result).toEqual(user);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const id = '1';
      const data = { name: 'John Doe' };
      const user = { id: 1, name: 'John Doe' };
      prisma.user.update.mockResolvedValue(user);

      const result = await updateUser(id, data);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: parseInt(id) },
        data,
      });
      expect(result).toEqual(user);
    });
  });

  describe('deleteUser', () => {
    it('should delete an existing user', async () => {
      const id = '1';
      const user = { id: 1, name: 'John' };
      prisma.user.delete.mockResolvedValue(user);

      const result = await deleteUser(id);

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: parseInt(id) },
      });
      expect(result).toEqual(user);
    });
  });
});