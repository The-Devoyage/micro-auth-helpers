import { Context } from "../../types";
import { ApolloError } from "apollo-server-errors";

export const CheckAuth = (options: {
  context: Context;
  requireUser?: boolean;
  requireAccount?: boolean;
  errorMessage?: string;
}) => {
  const { context, requireUser, errorMessage, requireAccount } = options;

  if (!context.auth.isAuth)
    throw new ApolloError(
      errorMessage ?? "Not Authenticated",
      "UNAUTHENTICATED"
    );

  if (requireAccount && context.auth.payload) {
    if (!("account" in context.auth.payload)) {
      throw new ApolloError(
        errorMessage ?? "Requires Account.",
        "UNAUTHORIZED"
      );
    }
  }

  if (requireUser && context.auth.payload) {
    if (!("user" in context.auth.payload)) {
      throw new ApolloError(
        errorMessage ?? "Requires User Authentiction",
        "UNAUTHORIZED"
      );
    }
  }
};
