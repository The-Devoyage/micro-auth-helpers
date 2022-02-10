import { Request } from 'express';
import { Context, DecodedToken } from 'src/types';

export const GenerateContext = (params: {
  req: Request;
  custom?: Record<string, any>;
}): Context => {
  const { req, custom } = params;

  const tokenHeader = req.get('token');
  const isAuthHeader = req.get('isauth');

  let decodedToken: DecodedToken = {};
  let isAuth: boolean = false;

  if (tokenHeader) {
    decodedToken = JSON.parse(tokenHeader);
  }
  if (isAuthHeader) {
    isAuth = JSON.parse(isAuthHeader);
  }

  return { auth: { decodedToken, isAuth }, ...custom };
};
