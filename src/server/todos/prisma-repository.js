// @ts-nocheck
import { db } from "../db";

export const prismaTodoRepository = {
  async create(description) {
    return db.todo.create({ data: { description } });
  },

  async list() {
    return db.todo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async updateCompletion(id, completed) {
    const existing = await db.todo.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }

    return db.todo.update({
      where: { id },
      data: { completed },
    });
  },

  async deleteById(id) {
    const result = await db.todo.deleteMany({ where: { id } });
    return result.count > 0;
  },
};
