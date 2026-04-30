// @ts-nocheck
import { NotFoundError } from "../api/errors.js";
import { fail, ok } from "../api/envelope.js";
import { handleApiError } from "../api/http.js";
import { toTodoPayload } from "./serializer.js";
import { parseCreateBody, parseIdParam, parsePatchBody } from "./validation.js";

export const createTodosIndexHandler = ({ repo }) => {
  return async (req, res) => {
    if (req.method === "GET") {
      try {
        const todos = await repo.list();
        res.status(200).json(ok(todos.map(toTodoPayload)));
      } catch (error) {
        handleApiError(error, res);
      }
      return;
    }

    if (req.method === "POST") {
      try {
        const body = parseCreateBody(req.body);
        const todo = await repo.create(body.description);
        res.status(201).json(ok(toTodoPayload(todo)));
      } catch (error) {
        handleApiError(error, res);
      }
      return;
    }

    res.setHeader("Allow", "GET, POST");
    res.status(405).json(fail("METHOD_NOT_ALLOWED", "Method not allowed"));
  };
};

export const createTodoByIdHandler = ({ repo }) => {
  return async (req, res) => {
    if (req.method === "PATCH") {
      try {
        const id = parseIdParam(req.query.id);
        const body = parsePatchBody(req.body);
        const updated = await repo.updateCompletion(id, body.completed);

        if (!updated) {
          throw new NotFoundError("Todo not found");
        }

        res.status(200).json(ok(toTodoPayload(updated)));
      } catch (error) {
        handleApiError(error, res);
      }
      return;
    }

    if (req.method === "DELETE") {
      try {
        const id = parseIdParam(req.query.id);
        const deleted = await repo.deleteById(id);

        if (!deleted) {
          throw new NotFoundError("Todo not found");
        }

        res.status(200).json(ok({ id }));
      } catch (error) {
        handleApiError(error, res);
      }
      return;
    }

    res.setHeader("Allow", "PATCH, DELETE");
    res.status(405).json(fail("METHOD_NOT_ALLOWED", "Method not allowed"));
  };
};
