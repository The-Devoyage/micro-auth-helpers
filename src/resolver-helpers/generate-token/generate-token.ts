import { DecodedToken } from "@src/types";
import jwt from "jsonwebtoken";

export const GenerateToken = (params: {
  decodedToken: DecodedToken;
  secretOrPublicKey: jwt.Secret;
  options?: jwt.SignOptions;
}) => {
  const { decodedToken, secretOrPublicKey, options } = params;

  const token = jwt.sign(decodedToken, secretOrPublicKey, options);

  return token;
};
