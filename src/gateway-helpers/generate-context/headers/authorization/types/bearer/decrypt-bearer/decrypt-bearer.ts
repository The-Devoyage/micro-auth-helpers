import { Context, Payload } from "@src/types";
import jwt from "jsonwebtoken";

export const DecryptBearer = (params: {
  authHeader: string;
  context: Context;
  secretOrPublicKey?: jwt.Secret;
}): Context => {
  const { authHeader, secretOrPublicKey, context } = params;

  if (!authHeader) return context;

  const token = authHeader.split(" ")[1];

  if (!token || token === "") {
    context.auth.error =
      "Authorization header was provided, but did not contain jwt.";
    return context;
  }

  let payload: Payload;

  if (!secretOrPublicKey) {
    context.auth.error =
      "Secret or public key is missing. Key is required to decode and authenticate jwt.";
    return context;
  }

  try {
    payload = jwt.verify(token, secretOrPublicKey) as Payload;
  } catch (error) {
    console.log(error);
    context.auth.error = error as string;
    return context;
  }

  context.auth.isAuth = true;
  context.auth.payload = payload;

  return context;
};
