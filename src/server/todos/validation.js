// @ts-nocheck
import { z } from "zod";
import { ValidationError } from "../api/errors.js";

const createBodySchema = z.object({
  description: z.string().trim().min(1).max(200),
});

const patchBodySchema = z.object({
  completed: z.boolean(),
});

export const parseCreateBody = (body) => {
  const parsed = createBodySchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError(
      "Invalid request body",
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  return { description: parsed.data.description };
};

export const parsePatchBody = (body) => {
  const parsed = patchBodySchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError(
      "Invalid request body",
      parsed.error.issues.map((issue) => issue.message),
    );
  }

  return parsed.data;
};

export const parseIdParam = (idParam) => {
  const raw = Array.isArray(idParam) ? idParam[0] : idParam;
  const id = Number(raw);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError("Invalid path parameter", ["id must be a positive integer"]);
  }

  return id;
};
