import { Request } from "express";
import jwt from "jsonwebtoken";
import { DecodedToken, Context } from "src/types";

export const GenerateContext = async (params: {
  req: Request;
  secretOrPublicKey?: jwt.Secret;
}): Promise<Context> => {
  const { req, secretOrPublicKey } = params;

  const authHeader = req.get("Authorization");

  if (!authHeader) return { auth: { isAuth: false } };

  const token = authHeader.split(" ")[1];

  if (!token || token === "")
    return {
      auth: {
        isAuth: false,
        error: "Token property was provided but is not valid.",
      },
    };

  let decodedToken: DecodedToken;

  if (!secretOrPublicKey) {
    return {
      auth: {
        isAuth: false,
        error:
          "Token is provided, but secret or public Decrypting key is missing. Key is required to decode token.",
      },
    };
  }

  try {
    decodedToken = jwt.verify(token, secretOrPublicKey) as DecodedToken;
  } catch (error) {
    console.log(error);
    return { auth: { isAuth: false, error: error as string } };
  }

  return {
    auth: {
      decodedToken,
      isAuth: true,
    },
  };
};
