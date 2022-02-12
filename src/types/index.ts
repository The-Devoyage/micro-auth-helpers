import { Request } from "express";
import jwt from "jsonwebtoken";

export interface AuthContext {
  payload: Payload;
  isAuth: boolean;
  error?: string;
}

export interface Context extends Record<string, any> {
  auth: AuthContext;
}

export interface Payload extends jwt.JwtPayload {
  account: { _id: string; email: string } | null;
  user: { _id: string; role: number; email: string } | null;
}

export interface GenerateGatewayContextParams {
  req: Request;
  secretOrPublicKey?: jwt.Secret;
  headers: string[];
  inject?: Record<string, any>;
}

export interface ParseAuthorizationParms
  extends Omit<GenerateGatewayContextParams, "inject" | "headers"> {
  context: Context;
}
