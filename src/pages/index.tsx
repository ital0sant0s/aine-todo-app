import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  createTodo,
  fetchTodos,
  insertTodoNewestFirst,
  validateTodoDescription,
} from "~/features/todos/client.js";

type Todo = {
  id: number;
  description: string;
  completed: boolean;
  createdAt: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const initialTodos = await fetchTodos();
        if (!mounted) return;
        setTodos(initialTodos);
      } catch (error) {
        if (!mounted) return;
        const message =
          error instanceof Error
            ? error.message
            : "Could not load todos. Please refresh and try again.";
        setLoadError(message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

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
      const message =
        error instanceof Error
          ? error.message
          : "Could not create todo. Please try again.";
      setCreateError(message);
    } finally {
      setIsCreating(false);
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
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Aine Todo
            </h1>
            <p className="text-sm text-slate-300 sm:text-base">
              Add tasks and see them instantly in your list.
            </p>
          </header>

          <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5">
            <form className="space-y-3" onSubmit={handleSubmit} noValidate>
              <label className="block text-sm font-medium" htmlFor="todo-input">
                New todo
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="todo-input"
                  name="description"
                  type="text"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={200}
                  placeholder="e.g. Prepare sprint review notes"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-offset-2 ring-offset-slate-950 focus-visible:ring-2 focus-visible:ring-cyan-400"
                  aria-invalid={validationError ? "true" : "false"}
                  aria-describedby={validationError ? "todo-validation-error" : undefined}
                />
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
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
            aria-live="polite"
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your todos</h2>
              <span className="text-sm text-slate-300">{itemCountLabel}</span>
            </div>

            {isLoading ? <p className="text-slate-300">Loading todos...</p> : null}
            {!isLoading && loadError ? (
              <p className="text-rose-300" role="status">
                {loadError}
              </p>
            ) : null}
            {!isLoading && !loadError && todos.length === 0 ? (
              <p className="text-slate-300">No todos yet. Add your first task above.</p>
            ) : null}
            {!isLoading && !loadError && todos.length > 0 ? (
              <ul className="space-y-3">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2"
                  >
                    <p className="font-medium text-slate-100">{todo.description}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Created {new Date(todo.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        </div>
      </main>
    </>
  );
}
