import { Request } from "express";
import jwt from "jsonwebtoken";
import { Context } from "src/types";
export declare const GenerateContext: (params: {
  req: Request;
  secretOrPublicKey?: jwt.Secret;
}) => Promise<Context>;
