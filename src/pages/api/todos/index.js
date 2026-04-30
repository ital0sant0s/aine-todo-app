// @ts-nocheck
import { prismaTodoRepository } from "../../../server/todos/prisma-repository";
import { createTodosIndexHandler } from "../../../server/todos/handlers";

const handler = createTodosIndexHandler({ repo: prismaTodoRepository });

export default handler;
