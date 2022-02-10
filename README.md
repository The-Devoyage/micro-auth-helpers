# The Devoyage - Micro Auth Helpers

A collection of functions to aid in authentication and authorization within a Federated Apollo Microservice Architecture.

## Install

Log into github.

```
npm login --registry=https://npm.pkg.github.com
```

Install

```
npm i @the-devoyage/micro-auth-helpers
```

## Usage

### Gateway Helpers

**Generate Context**

Decodes JSON web token and generates typed context to pass on to external micro-services.

```ts
import { Helpers } from "@the-devoyage/micro-auth-helpers";
import express from "express";
/// ...imports

const app = express();

// ...gateway

let apolloServer;

async function startServer() {
  apolloServer = new ApolloServer({
    gateway,
    context: ({ req }) => {
      return Helpers.Gateway.GenerateContext({
        req,
        secretOrPublicKey: process.env.JWT_ENCRYPTION_KEY,
      });
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}

startServer();

app.listen(port, () => console.log(`GATEWAY ====> UP ON PORT ${port}`));
```

The generate function returns type `Context` to be passed to external services:

```ts
export interface Context extends Record<string, any> {
  auth: AuthContext;
}

export interface AuthContext {
  decodedToken?: DecodedToken;
  isAuth: boolean;
  error?: string;
}

export interface DecodedToken extends jwt.JwtPayload {
  account?: { _id: string; email: string };
  user?: { _id: string; role: number; email: string };
}
```
