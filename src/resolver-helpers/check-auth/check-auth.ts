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

  if (requireAccount) {
    if (!("account" in context.auth.payload)) {
      throw new ApolloError(
        errorMessage ?? "Requires Account.",
        "UNAUTHORIZED"
      );
    }
  }

  if (requireUser) {
    if (!("user" in context.auth.payload) || !context.auth.payload.user) {
      throw new ApolloError(
        errorMessage ?? "Requires User Authentiction",
        "UNAUTHORIZED"
      );
    }
  }
};
