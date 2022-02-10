import { Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedToken, Context } from "src/types";

export const GenerateContext = async (params: {
  req: Request;
  secretOrPublicKey?: jwt.Secret;
  headers: string[];
}): Promise<Context> => {
  const { req, secretOrPublicKey, headers } = params;

  const context: Context = { auth: { isAuth: false } };

  if (headers.length) {
    for (const headerKey of headers) {
      const header = req.get(headerKey);
      context[headerKey] = header;
    }
  }

  if (!headers.includes("Authorization")) {
    return context;
  }

  const authHeader = req.get("Authorization");

  if (!authHeader) return context;

  const token = authHeader.split(" ")[1];

  if (!token || token === "") {
    context.auth.error =
      "Authorization header was provided, but did not contain jwt.";
    return context;
  }

  let decodedToken: DecodedToken;

  if (!secretOrPublicKey) {
    context.auth.error =
      "Secret or public Decrypting key is missing. Key is required to decode jwt.";
    return context;
  }

  try {
    decodedToken = jwt.verify(token, secretOrPublicKey) as DecodedToken;
  } catch (error) {
    console.log(error);
    context.auth.error = error as string;
    return context;
  }

  context.auth.isAuth = true;
  context.auth.decodedToken = decodedToken;

  return context;
};
