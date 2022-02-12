import { Context } from "src/types";

export const CheckAuth = (options: {
  context: Context;
  requireUser?: boolean;
  requireAccount?: boolean;
  errorMessage?: string;
}) => {
  const { context, requireUser, errorMessage, requireAccount } = options;

  if (!context.auth.isAuth)
    throw new Error(errorMessage ?? "Not Authenticated");

  if (requireAccount && context.auth.payload) {
    if (!("account" in context.auth.payload)) {
      throw new Error(errorMessage ?? "Requires Account.");
    }
  }

  if (requireUser && context.auth.payload) {
    if (!("user" in context.auth.payload)) {
      throw new Error(errorMessage ?? "Requires User Authentiction");
    }
  }
};
