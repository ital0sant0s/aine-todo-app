// @ts-check

/**
 * @typedef {{
 *   id: number;
 *   description: string;
 *   completed: boolean;
 *   createdAt: string;
 * }} Todo
 */

const DESCRIPTION_MAX_LENGTH = 200;

/**
 * @param {unknown} input
 */
const parseErrorMessage = (input) => {
  if (typeof input !== "object" || input === null) {
    return "Something went wrong. Please try again.";
  }

  const payload = /** @type {{ error?: { message?: unknown } }} */ (input);
  const message = payload.error?.message;
  if (typeof message === "string" && message.length > 0) {
    return message;
  }

  return "Something went wrong. Please try again.";
};

/**
 * @param {string} rawDescription
 */
export const validateTodoDescription = (rawDescription) => {
  const value = rawDescription.trim();
  if (value.length === 0) {
    return { ok: false, message: "Description is required." };
  }

  if (value.length > DESCRIPTION_MAX_LENGTH) {
    return {
      ok: false,
      message: `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`,
    };
  }

  return { ok: true, value };
};

/**
 * @param {Todo[]} todos
 * @param {Todo} todo
 * @returns {Todo[]}
 */
export const insertTodoNewestFirst = (todos, todo) =>
  [...todos, todo].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

/**
 * @param {typeof fetch} [fetchImpl]
 * @returns {Promise<Todo[]>}
 */
export const fetchTodos = async (fetchImpl = fetch) => {
  const response = await fetchImpl("/api/todos");
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(parseErrorMessage(payload));
  }

  return Array.isArray(payload.data) ? payload.data : [];
};

/**
 * @param {string} rawDescription
 * @param {typeof fetch} [fetchImpl]
 * @returns {Promise<Todo>}
 */
export const createTodo = async (rawDescription, fetchImpl = fetch) => {
  const validation = validateTodoDescription(rawDescription);
  if (!validation.ok) {
    throw new Error(validation.message);
  }

  const response = await fetchImpl("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description: validation.value }),
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(parseErrorMessage(payload));
  }

  return payload.data;
};
