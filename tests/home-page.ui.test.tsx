import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Home from "../src/pages/index";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Home page todo flow", () => {
  it("renders fetched todos on initial load", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        data: [
          {
            id: 2,
            description: "Newest",
            completed: false,
            createdAt: "2026-04-30T00:00:01.000Z",
          },
          {
            id: 1,
            description: "Older",
            completed: false,
            createdAt: "2026-04-30T00:00:00.000Z",
          },
        ],
      }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    render(createElement(Home));

    expect(screen.getByText("Loading todos...")).toBeInTheDocument();
    expect(await screen.findByText("Newest")).toBeInTheDocument();
    expect(screen.getByText("Older")).toBeInTheDocument();
    expect(screen.getByText("2 todos")).toBeInTheDocument();
  });

  it("creates a todo, clears input, and shows new item", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => { return { data: [] }; },
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            id: 99,
            description: "Buy milk",
            completed: false,
            createdAt: "2026-04-30T00:00:02.000Z",
          },
        }),
      });
    vi.stubGlobal("fetch", fetchMock);

    render(createElement(Home));
    await screen.findByText("No todos yet. Add your first task above.");

    const input = screen.getByLabelText("New todo");
    fireEvent.change(input, { target: { value: "  Buy milk  " } });
    fireEvent.click(screen.getByRole("button", { name: "Add todo" }));

    await screen.findByText("Buy milk");
    expect((input as HTMLInputElement).value).toBe("");
    expect(screen.getByText("1 todo")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/todos",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ description: "Buy milk" }),
      }),
    );
  });

  it("shows inline validation and skips API create call for invalid input", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ data: [] }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    render(createElement(Home));
    await screen.findByText("No todos yet. Add your first task above.");

    const input = screen.getByLabelText("New todo");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: "Add todo" }));

    expect(await screen.findByText("Description is required.")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("shows non-blocking error feedback when create fails", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: { code: "INTERNAL_SERVER_ERROR", message: "Could not save todo." },
        }),
      });
    vi.stubGlobal("fetch", fetchMock);

    render(createElement(Home));
    await screen.findByText("No todos yet. Add your first task above.");

    fireEvent.change(screen.getByLabelText("New todo"), {
      target: { value: "Write tests" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add todo" }));

    await waitFor(() => {
      expect(screen.getByText("Could not save todo.")).toBeInTheDocument();
    });
    expect(screen.getByText("No todos yet. Add your first task above.")).toBeInTheDocument();
  });

  it("marks a todo complete via PATCH, updates styling, and shows completed state after remount", async () => {
    const createdAt = "2026-04-30T00:00:00.000Z";
    const listItem = {
      id: 1,
      description: "Draft notes",
      completed: false,
      createdAt,
    };
    const completedItem = { ...listItem, completed: true };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [listItem] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: completedItem }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [completedItem] }),
      });

    vi.stubGlobal("fetch", fetchMock);

    render(createElement(Home));
    await screen.findByText("Draft notes");

    const checkbox = screen.getByRole("checkbox", { name: "Mark complete: Draft notes" });
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);

    await waitFor(() => expect(checkbox).toBeChecked());
    expect(screen.getByText("Draft notes")).toHaveClass("line-through");

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/todos/1",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ completed: true }),
      }),
    );

    cleanup();
    render(createElement(Home));
    await waitFor(() => {
      expect(screen.getByRole("checkbox", { name: "Mark incomplete: Draft notes" })).toBeChecked();
    });
  });

  it("deletes a todo via DELETE and it stays gone after remount", async () => {
    const a = {
      id: 1,
      description: "Stay",
      completed: false,
      createdAt: "2026-04-30T00:00:01.000Z",
    };
    const b = {
      id: 2,
      description: "Go away",
      completed: false,
      createdAt: "2026-04-30T00:00:00.000Z",
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [a, b] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { id: b.id } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [a] }),
      });

    vi.stubGlobal("fetch", fetchMock);

    render(createElement(Home));
    await screen.findByText("Go away");

    fireEvent.click(screen.getByRole("button", { name: "Delete todo: Go away" }));

    await waitFor(() => {
      expect(screen.queryByText("Go away")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Stay")).toBeInTheDocument();

    cleanup();
    render(createElement(Home));
    await waitFor(() => {
      expect(screen.getByText("Stay")).toBeInTheDocument();
    });
    expect(screen.queryByText("Go away")).not.toBeInTheDocument();
  });

  it("shows non-blocking error when toggle completion fails", async () => {
    const listItem = {
      id: 5,
      description: "Fragile task",
      completed: false,
      createdAt: "2026-04-30T00:00:00.000Z",
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [listItem] }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: { code: "INTERNAL_SERVER_ERROR", message: "Could not update completion." },
        }),
      });

    vi.stubGlobal("fetch", fetchMock);

    render(createElement(Home));
    await screen.findByText("Fragile task");

    fireEvent.click(screen.getByRole("checkbox", { name: "Mark complete: Fragile task" }));

    await waitFor(() => {
      expect(screen.getByText("Could not update completion.")).toBeInTheDocument();
    });
    expect(screen.getByRole("checkbox", { name: "Mark complete: Fragile task" })).not.toBeChecked();
  });

  it("shows non-blocking error when delete fails", async () => {
    const listItem = {
      id: 7,
      description: "Protected task",
      completed: false,
      createdAt: "2026-04-30T00:00:00.000Z",
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [listItem] }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: { code: "INTERNAL_SERVER_ERROR", message: "Could not delete todo." },
        }),
      });

    vi.stubGlobal("fetch", fetchMock);

    render(createElement(Home));
    await screen.findByText("Protected task");

    fireEvent.click(screen.getByRole("button", { name: "Delete todo: Protected task" }));

    await waitFor(() => {
      expect(screen.getByText("Could not delete todo.")).toBeInTheDocument();
    });
    expect(screen.getByText("Protected task")).toBeInTheDocument();
  });
});
