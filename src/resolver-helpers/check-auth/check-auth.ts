import { Context } from 'src/types';

export const CheckAuth = (options: {
  context: Context;
  requireUser?: boolean;
  errorMessage?: string;
}) => {
  const { context, requireUser, errorMessage } = options;

  if (!context.auth.isAuth)
    throw new Error(errorMessage ?? 'Not Authenticated');

  if (requireUser && context.auth.decodedToken) {
    if (!('user' in context.auth.decodedToken)) {
      throw new Error(errorMessage ?? 'Requires User Authentiction');
    }
  }
};
