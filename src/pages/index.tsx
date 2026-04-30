import Head from "next/head";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";

import {
  createTodo,
  deleteTodo,
  fetchTodos,
  insertTodoNewestFirst,
  sortTodosNewestFirst,
  updateTodoCompleted,
  validateTodoDescription,
} from "~/features/todos/client.js";

type Todo = {
  id: number;
  description: string;
  completed: boolean;
  createdAt: string;
};

type MutationOperation = "create" | "toggle" | "delete";

function formatMutationOperationError(operation: MutationOperation, detail: string): string {
  const recovery =
    operation === "create"
      ? "Try adding the todo again or check your connection."
      : operation === "toggle"
        ? "Try toggling completion again or check your connection."
        : "Try deleting again or check your connection.";
  const label = operation === "create" ? "Create" : operation === "toggle" ? "Toggle" : "Delete";
  const trimmedDetail = detail.trim();
  const body = trimmedDetail.length > 0 ? trimmedDetail : "Something went wrong.";
  const separator = /[.!?]$/.test(body) ? "" : ".";
  return `${label}: ${body}${separator} ${recovery}`;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [togglePendingById, setTogglePendingById] = useState<Record<number, boolean>>({});
  const [deletePendingById, setDeletePendingById] = useState<Record<number, boolean>>({});
  const [toggleErrorById, setToggleErrorById] = useState<Record<number, string>>({});
  const [deleteErrorById, setDeleteErrorById] = useState<Record<number, string>>({});

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadTodos = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const initialTodos = await fetchTodos();
      if (!mountedRef.current) return;
      setTodos(initialTodos);
    } catch (error) {
      if (!mountedRef.current) return;
      const message =
        error instanceof Error
          ? error.message
          : "Could not load todos. Please refresh and try again.";
      setLoadError(message);
    } finally {
      if (mountedRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTodos();
  }, [loadTodos]);

  const itemCountLabel = useMemo(() => {
    const count = todos.length;
    if (count === 1) return "1 todo";
    return `${count} todos`;
  }, [todos]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError(null);

    const validation = validateTodoDescription(description);
    if (!validation.ok) {
      setValidationError(validation.message ?? "Description is required.");
      return;
    }

    setValidationError(null);
    setIsCreating(true);
    try {
      const created = await createTodo(description);
      setTodos((current) => insertTodoNewestFirst(current, created));
      setDescription("");
    } catch (error) {
      const detail =
        error instanceof Error
          ? error.message
          : "Could not create todo. Please try again.";
      setCreateError(formatMutationOperationError("create", detail));
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleCompleted = async (todo: Todo) => {
    setToggleErrorById((current) => {
      const next = { ...current };
      delete next[todo.id];
      return next;
    });
    setTogglePendingById((current) => ({ ...current, [todo.id]: true }));
    try {
      const updated = await updateTodoCompleted(todo.id, !todo.completed);
      setTodos((current) =>
        sortTodosNewestFirst(current.map((t) => (t.id === updated.id ? updated : t))),
      );
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : "Could not update todo. Try again.";
      setToggleErrorById((current) => ({
        ...current,
        [todo.id]: formatMutationOperationError("toggle", detail),
      }));
    } finally {
      setTogglePendingById((current) => {
        const next = { ...current };
        delete next[todo.id];
        return next;
      });
    }
  };

  const handleDeleteTodo = async (todo: Todo) => {
    setDeleteErrorById((current) => {
      const next = { ...current };
      delete next[todo.id];
      return next;
    });
    setDeletePendingById((current) => ({ ...current, [todo.id]: true }));
    try {
      await deleteTodo(todo.id);
      setTodos((current) => current.filter((t) => t.id !== todo.id));
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : "Could not delete todo. Try again.";
      setDeleteErrorById((current) => ({
        ...current,
        [todo.id]: formatMutationOperationError("delete", detail),
      }));
    } finally {
      setDeletePendingById((current) => {
        const next = { ...current };
        delete next[todo.id];
        return next;
      });
    }
  };

  return (
    <>
      <Head>
        <title>Aine Todo</title>
        <meta
          name="description"
          content="Create and view your todos in a fast, clear workflow."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen w-full min-w-0 overflow-x-clip bg-slate-950 text-slate-100">
        <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Aine Todo
            </h1>
            <p className="text-sm text-slate-300 sm:text-base">
              Add tasks and see them instantly in your list.
            </p>
          </header>

          <section className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
            <form className="space-y-3" onSubmit={handleSubmit} noValidate>
              <label className="block text-sm font-medium" htmlFor="todo-input">
                New todo
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <div className="min-w-0 flex-1">
                  <input
                    id="todo-input"
                    name="description"
                    type="text"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    maxLength={200}
                    placeholder="e.g. Prepare sprint review notes"
                    className="w-full min-w-0 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-offset-2 ring-offset-slate-950 focus-visible:ring-2 focus-visible:ring-cyan-400"
                    aria-invalid={validationError ? "true" : "false"}
                    aria-describedby={validationError ? "todo-validation-error" : undefined}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="shrink-0 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 outline-none transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? "Adding..." : "Add todo"}
                </button>
              </div>
              {validationError ? (
                <p id="todo-validation-error" className="text-sm text-amber-300">
                  {validationError}
                </p>
              ) : null}
              {createError ? (
                <p className="text-sm text-rose-300" role="status">
                  {createError}
                </p>
              ) : null}
            </form>
          </section>

          <section
            role="region"
            aria-labelledby="your-todos-heading"
            aria-live="polite"
            aria-busy={isLoading}
            className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="your-todos-heading" className="text-xl font-semibold">
                Your todos
              </h2>
              <span className="text-sm text-slate-300">{itemCountLabel}</span>
            </div>

            {isLoading ? (
              <p className="text-slate-300" role="status">
                Loading todos...
              </p>
            ) : null}
            {!isLoading && loadError ? (
              <div className="space-y-3">
                <p className="text-rose-300" role="status">
                  {loadError}
                </p>
                <button
                  type="button"
                  className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-500/50 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => void loadTodos()}
                >
                  Retry loading todos
                </button>
              </div>
            ) : null}
            {!isLoading && !loadError && todos.length === 0 ? (
              <p className="text-slate-300">No todos yet. Add your first task above.</p>
            ) : null}
            {!isLoading && !loadError && todos.length > 0 ? (
              <ul className="space-y-3">
                {todos.map((todo) => {
                  const togglePending = togglePendingById[todo.id] ?? false;
                  const deletePending = deletePendingById[todo.id] ?? false;
                  const toggleErr = toggleErrorById[todo.id];
                  const deleteErr = deleteErrorById[todo.id];

                  return (
                    <li
                      key={todo.id}
                      className="min-w-0 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-3"
                    >
                      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                        <div className="flex min-w-0 flex-1 gap-3">
                          <input
                            id={`todo-complete-${todo.id}`}
                            type="checkbox"
                            className="mt-1 size-4 shrink-0 rounded border-slate-600 bg-slate-950 text-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                            checked={todo.completed}
                            disabled={togglePending || deletePending}
                            onChange={() => void handleToggleCompleted(todo)}
                            aria-label={
                              todo.completed
                                ? `Mark incomplete: ${todo.description}`
                                : `Mark complete: ${todo.description}`
                            }
                          />
                          <div className="min-w-0 flex-1">
                            <label
                              className={`block cursor-pointer select-none break-words font-medium ${
                                todo.completed
                                  ? "text-slate-500 line-through decoration-slate-500"
                                  : "text-slate-100"
                              }`}
                              htmlFor={`todo-complete-${todo.id}`}
                            >
                              {todo.description}
                            </label>
                            <p className="mt-1 text-xs text-slate-400">
                              Created {new Date(todo.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex w-full shrink-0 flex-col items-stretch gap-2 sm:w-auto">
                          <button
                            type="button"
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:border-rose-500/60 hover:text-rose-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            onClick={() => void handleDeleteTodo(todo)}
                            disabled={togglePending || deletePending}
                            aria-label={`Delete todo: ${todo.description}`}
                          >
                            {deletePending ? "Deleting..." : "Delete"}
                          </button>
                          {toggleErr ? (
                            <p className="text-xs text-rose-300 sm:text-right" role="status">
                              {toggleErr}
                            </p>
                          ) : null}
                          {deleteErr ? (
                            <p className="text-xs text-rose-300 sm:text-right" role="status">
                              {deleteErr}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </section>
        </div>
      </main>
    </>
  );
}
