import { Context, GenerateGatewayContextParams } from "../../types";
import { Headers } from "./headers";

export const GenerateContext = async (
  params: GenerateGatewayContextParams
): Promise<Context> => {
  const { req, secretOrPublicKey, headers, inject } = params;

  let context: Context = {
    auth: { isAuth: false, payload: { account: null, user: null } },
    ...inject,
  };

  if (headers.length) {
    for (const headerKey of headers) {
      const header = req.get(headerKey);
      context[headerKey] = header;
    }
  }

  if (!headers.includes("Authorization")) {
    return context;
  }

  context = Headers.Authorization.ParseAuthorization({
    context,
    req,
    secretOrPublicKey,
  }).context;

  return context;
};
