import { ApolloError } from "apollo-server-errors";

export const LimitRole = (options: {
  userRole?: number;
  roleLimit?: number;
  errorMessage?: string;
}) => {
  const { userRole = 100, roleLimit = 1, errorMessage } = options;

  if (userRole !== 1) {
    if (userRole > roleLimit)
      throw new ApolloError(
        `Permission denied. ${
          errorMessage ?? "You are not authorized to view/edit these details."
        }`,
        "UNAUTHORIZED"
      );
  }
};
