// @ts-nocheck
export const toTodoPayload = (todo) => ({
  id: todo.id,
  description: todo.description,
  completed: todo.completed,
  createdAt: todo.createdAt.toISOString(),
});
