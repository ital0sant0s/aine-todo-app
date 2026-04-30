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
});
