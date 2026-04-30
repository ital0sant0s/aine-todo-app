import assert from "node:assert/strict";
import process from "node:process";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  const description = `story-1-1-default-check-${Date.now()}`;

  const created = await prisma.todo.create({
    data: { description },
  });

  assert.equal(created.completed, false, "completed should default to false");
  assert.equal(created.description, description);

  const fromDb = await prisma.todo.findUnique({
    where: { id: created.id },
  });

  assert.ok(fromDb, "todo should exist in database");
  assert.equal(fromDb.completed, false, "persisted completed should be false");

  await prisma.todo.delete({ where: { id: created.id } });
  console.log("Todo default-completed integration check passed.");
}

main()
  .catch((error) => {
    console.error("Todo default-completed integration check failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
