import { Payload } from "../../types";
import jwt from "jsonwebtoken";

export const GenerateToken = (params: {
  payload: Payload;
  secretOrPublicKey: jwt.Secret;
  options?: jwt.SignOptions;
}) => {
  const { payload, secretOrPublicKey, options } = params;

  const token = jwt.sign(payload, secretOrPublicKey, options);

  return token;
};
