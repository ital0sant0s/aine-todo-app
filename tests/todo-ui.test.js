// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";

import {
  createTodo,
  deleteTodo,
  fetchTodos,
  insertTodoNewestFirst,
  updateTodoCompleted,
  validateTodoDescription,
} from "../src/features/todos/client.js";

test("validateTodoDescription rejects empty/whitespace/over-limit values", () => {
  const empty = validateTodoDescription("");
  assert.equal(empty.ok, false);

  const whitespace = validateTodoDescription("   ");
  assert.equal(whitespace.ok, false);

  const overLimit = validateTodoDescription("a".repeat(201));
  assert.equal(overLimit.ok, false);
});

test("validateTodoDescription trims and accepts valid values", () => {
  const result = validateTodoDescription("  Buy milk  ");
  assert.equal(result.ok, true);
  assert.equal(result.value, "Buy milk");
});

test("insertTodoNewestFirst keeps newest-first ordering", () => {
  const older = {
    id: 1,
    description: "Older",
    completed: false,
    createdAt: "2026-04-30T00:00:00.000Z",
  };
  const newer = {
    id: 2,
    description: "Newer",
    completed: false,
    createdAt: "2026-04-30T00:00:01.000Z",
  };

  const ordered = insertTodoNewestFirst([older], newer);
  assert.equal(ordered[0]?.description, "Newer");
  assert.equal(ordered[1]?.description, "Older");
});

test("fetchTodos returns data from API envelope", async () => {
  const fetchMock = async () => ({
    ok: true,
    async json() {
      return {
        data: [
          {
            id: 1,
            description: "Todo",
            completed: false,
            createdAt: "2026-04-30T00:00:00.000Z",
          },
        ],
      };
    },
  });

  const todos = await fetchTodos(fetchMock);
  assert.equal(todos.length, 1);
  assert.equal(todos[0]?.description, "Todo");
});

test("createTodo posts trimmed description and returns created todo", async () => {
  let capturedBody;
  const fetchMock = async (_url, init) => {
    capturedBody = init?.body;
    return {
      ok: true,
      async json() {
        return {
          data: {
            id: 10,
            description: "Trimmed value",
            completed: false,
            createdAt: "2026-04-30T00:00:00.000Z",
          },
        };
      },
    };
  };

  const todo = await createTodo("  Trimmed value  ", fetchMock);
  assert.equal(JSON.parse(capturedBody).description, "Trimmed value");
  assert.equal(todo.description, "Trimmed value");
});

test("updateTodoCompleted PATCHes completion and returns updated todo", async () => {
  let capturedBody;
  const fetchMock = async (url, init) => {
    assert.equal(url, "/api/todos/3");
    assert.equal(init?.method, "PATCH");
    capturedBody = init?.body;
    return {
      ok: true,
      async json() {
        return {
          data: {
            id: 3,
            description: "Task",
            completed: true,
            createdAt: "2026-04-30T00:00:00.000Z",
          },
        };
      },
    };
  };

  const updated = await updateTodoCompleted(3, true, fetchMock);
  assert.equal(JSON.parse(capturedBody).completed, true);
  assert.equal(updated.completed, true);
});

test("deleteTodo DELETEs by id and returns envelope data", async () => {
  const fetchMock = async (url, init) => {
    assert.equal(url, "/api/todos/8");
    assert.equal(init?.method, "DELETE");
    return {
      ok: true,
      async json() {
        return { data: { id: 8 } };
      },
    };
  };

  const result = await deleteTodo(8, fetchMock);
  assert.deepEqual(result, { id: 8 });
});

