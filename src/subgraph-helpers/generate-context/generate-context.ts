import { Request } from "express";
import { Context } from "src/types";

export const GenerateContext = (params: {
  req: Request;
  inject?: Record<string, any>;
}): Context => {
  const { req, inject } = params;

  const contextHeader = req.get("context");

  let context: Context = { auth: { isAuth: false } };

  if (contextHeader) {
    context = JSON.parse(contextHeader);
  }

  return { ...context, ...inject };
};
