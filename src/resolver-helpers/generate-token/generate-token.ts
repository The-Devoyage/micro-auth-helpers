import { Payload } from "../../types";
import jwt from "jsonwebtoken";

export const GenerateToken = (params: {
  payload: Payload;
  secretOrPrivateKey: jwt.Secret;
  options?: jwt.SignOptions;
}) => {
  const { payload, secretOrPrivateKey, options } = params;

  const token = jwt.sign(payload, secretOrPrivateKey, options);

  return token;
};
