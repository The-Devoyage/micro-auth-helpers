import { Request } from "express";
import { Context } from "../../types";

export const GenerateContext = (params: {
  req: Request;
  inject?: Record<string, any>;
}): Context => {
  const { req, inject } = params;

  const contextHeader = req.get("context");

  let context: Context = {
    auth: { isAuth: false, payload: { account: null, user: null } },
  };

  if (contextHeader) {
    context = JSON.parse(contextHeader);
  }

  return { ...context, ...inject };
};
