import { Context, ParseAuthorizationParms } from "../../../../../types";
import jwt from "jsonwebtoken";
import { Headers } from "../../headers";

export const ParseAuthorization = (
  params: ParseAuthorizationParms
): {
  context: Context;
  authHeader?: {
    type: "BEARER" | undefined;
    header: string | undefined;
    secretOrPublicKey?: jwt.Secret;
  };
} => {
  let { context } = params;
  const { req, secretOrPublicKey } = params;

  const authHeader = req.get("Authorization");

  if (!authHeader) return { context };

  if (authHeader.includes("Bearer")) {
    context = Headers.Authorization.Bearer.Bearer.DecryptBearer({
      authHeader,
      secretOrPublicKey,
      context,
    });

    return { context, authHeader: { header: authHeader, type: "BEARER" } };
  }

  return { context };
};
