// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";

import {
  createTodoByIdHandler,
  createTodosIndexHandler,
} from "../src/server/todos/handlers.js";

const createMemoryRepo = () => {
  let nextId = 1;
  const todos = [];

  return {
    async create(description) {
      const timestamp = new Date(nextId * 1000);
      const todo = {
        id: nextId++,
        description,
        completed: false,
        createdAt: timestamp,
      };
      todos.push(todo);
      return todo;
    },
    async list() {
      return [...todos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    async updateCompletion(id, completed) {
      const todo = todos.find((item) => item.id === id);
      if (!todo) return null;
      todo.completed = completed;
      return todo;
    },
    async deleteById(id) {
      const idx = todos.findIndex((item) => item.id === id);
      if (idx === -1) return false;
      todos.splice(idx, 1);
      return true;
    },
  };
};

const createMockRes = () => ({
  statusCode: 200,
  headers: {},
  body: undefined,
  status(code) {
    this.statusCode = code;
    return this;
  },
  setHeader(key, value) {
    this.headers[key] = value;
  },
  json(payload) {
    this.body = payload;
    return this;
  },
});

test("CRUD routes persist changes and return consistent envelopes", async () => {
  const repo = createMemoryRepo();
  const todosIndex = createTodosIndexHandler({ repo });
  const todoById = createTodoByIdHandler({ repo });

  const createRes = createMockRes();
  await todosIndex({ method: "POST", body: { description: "  Buy milk  " } }, createRes);
  assert.equal(createRes.statusCode, 201);
  assert.equal(createRes.body.data.description, "Buy milk");
  assert.equal(createRes.body.data.completed, false);

  const listRes = createMockRes();
  await todosIndex({ method: "GET", body: null }, listRes);
  assert.equal(listRes.statusCode, 200);
  assert.equal(Array.isArray(listRes.body.data), true);
  assert.equal(listRes.body.data.length, 1);

  const patchRes = createMockRes();
  await todoById(
    { method: "PATCH", query: { id: "1" }, body: { completed: true } },
    patchRes,
  );
  assert.equal(patchRes.statusCode, 200);
  assert.equal(patchRes.body.data.completed, true);

  const deleteRes = createMockRes();
  await todoById({ method: "DELETE", query: { id: "1" }, body: null }, deleteRes);
  assert.equal(deleteRes.statusCode, 200);
  assert.deepEqual(deleteRes.body, { data: { id: 1 } });

  const listAfterDeleteRes = createMockRes();
  await todosIndex({ method: "GET", body: null }, listAfterDeleteRes);
  assert.equal(listAfterDeleteRes.body.data.length, 0);
});

test("validation errors return HTTP 400 with error envelope", async () => {
  const repo = createMemoryRepo();
  const todosIndex = createTodosIndexHandler({ repo });
  const todoById = createTodoByIdHandler({ repo });

  const badCreate = createMockRes();
  await todosIndex({ method: "POST", body: { description: "   " } }, badCreate);
  assert.equal(badCreate.statusCode, 400);
  assert.equal(badCreate.body.error.code, "VALIDATION_ERROR");

  const badPatch = createMockRes();
  await todoById(
    { method: "PATCH", query: { id: "abc" }, body: { completed: true } },
    badPatch,
  );
  assert.equal(badPatch.statusCode, 400);
  assert.equal(badPatch.body.error.code, "VALIDATION_ERROR");
});

test("GET /api/todos returns newest-first order", async () => {
  const repo = createMemoryRepo();
  const todosIndex = createTodosIndexHandler({ repo });

  const firstCreateRes = createMockRes();
  await todosIndex({ method: "POST", body: { description: "Older todo" } }, firstCreateRes);
  assert.equal(firstCreateRes.statusCode, 201);

  const secondCreateRes = createMockRes();
  await todosIndex(
    { method: "POST", body: { description: "Newer todo" } },
    secondCreateRes,
  );
  assert.equal(secondCreateRes.statusCode, 201);

  const listRes = createMockRes();
  await todosIndex({ method: "GET", body: null }, listRes);
  assert.equal(listRes.statusCode, 200);
  assert.equal(listRes.body.data[0].description, "Newer todo");
  assert.equal(listRes.body.data[1].description, "Older todo");
});

test("not found paths return HTTP 404 with error envelope", async () => {
  const repo = createMemoryRepo();
  const todoById = createTodoByIdHandler({ repo });

  const patchNotFound = createMockRes();
  await todoById(
    { method: "PATCH", query: { id: "999" }, body: { completed: true } },
    patchNotFound,
  );
  assert.equal(patchNotFound.statusCode, 404);
  assert.equal(patchNotFound.body.error.code, "NOT_FOUND");

  const deleteNotFound = createMockRes();
  await todoById(
    { method: "DELETE", query: { id: "999" }, body: null },
    deleteNotFound,
  );
  assert.equal(deleteNotFound.statusCode, 404);
  assert.equal(deleteNotFound.body.error.code, "NOT_FOUND");
});

test("unexpected repository failure returns HTTP 500 error envelope", async () => {
  const repo = {
    async create() {
      throw new Error("not used");
    },
    async list() {
      throw new Error("boom");
    },
    async updateCompletion() {
      throw new Error("not used");
    },
    async deleteById() {
      throw new Error("not used");
    },
  };
  const todosIndex = createTodosIndexHandler({ repo });

  const listRes = createMockRes();
  await todosIndex({ method: "GET", body: null }, listRes);
  assert.equal(listRes.statusCode, 500);
  assert.equal(listRes.body.error.code, "INTERNAL_SERVER_ERROR");
  assert.equal(listRes.body.error.message, "Unexpected server error");
});
