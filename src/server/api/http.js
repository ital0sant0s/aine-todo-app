// @ts-nocheck
import { NotFoundError, ValidationError } from "./errors.js";
import { fail } from "./envelope.js";

export const handleApiError = (error, res) => {
  if (error instanceof ValidationError) {
    res.status(400).json(fail("VALIDATION_ERROR", error.message, error.details));
    return;
  }

  if (error instanceof NotFoundError) {
    res.status(404).json(fail("NOT_FOUND", error.message));
    return;
  }

  res
    .status(500)
    .json(fail("INTERNAL_SERVER_ERROR", "Unexpected server error"));
};
