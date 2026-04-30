// @ts-nocheck
import { prismaTodoRepository } from "../../../server/todos/prisma-repository";
import { createTodoByIdHandler } from "../../../server/todos/handlers";

const handler = createTodoByIdHandler({ repo: prismaTodoRepository });

export default handler;
