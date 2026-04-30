// @ts-nocheck
export const ok = (data) => ({ data });

export const fail = (code, message, details = []) => ({
  error: {
    code,
    message,
    details,
  },
});
