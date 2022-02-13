# The Devoyage - Micro Auth Helpers

A collection of functions to make life easier when dealing with authentication, authorization, context routing, file uploads and more within a Federated Apollo Microservice Architecture.

## Install

Log into the Github Registry

```
npm login --registry=https://npm.pkg.github.com
```

Add the scope to your .npmrc file, run the following command from the root of the project.

```
echo @the-devoyage:--regitry=https://npm.pkg.github.com >> .npmrc
```

Install

```
npm i @the-devoyage/micro-auth-helpers
```

## Usage

### Gateway Helpers

Helper functions to use within a Gateway Service.

**Generate Gateway Context**

Creates context at the gateway level based on the incoming request headers or custom "injected" data.

By default, no headers are included. Instruct the `GenerateContext` function to include headers by passing header keys in the `headers` array.

`Authorization` headers that are `Bearer` tokens are automatically decoded -- if the secretOrPublicKey is provided. For example: `Authorization: Bearer ${token}`. All other `Authorization` headers are simply added to context.

```ts
import { Helpers } from "@the-devoyage/micro-auth-helpers";
import express from "express";
/// ...imports

const app = express();

const gateway = new ApolloGateway({
  //...gatewayConfig
});

let apolloServer;

async function startServer() {
  apolloServer = new ApolloServer({
    gateway,
    context: ({ req }) => {
      return Helpers.Gateway.GenerateContext({
        req,
        secretOrPublicKey: process.env.JWT_ENCRYPTION_KEY,
        headers: ["Authorization", "Content-Type", "Custom_Header"],
        inject: { customKey: customContext },
      });
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}

startServer();

app.listen(port, () => console.log(`GATEWAY ====> UP ON PORT ${port}`));
```

The `GenerateContext` function returns type `Context` to be passed to external subgraphs. It always include `auth` context in addition to any other headers that you have instructed it to provide and data that has been "injected".

```ts
export interface Context extends Record<string, any> {
  auth: AuthContext;
}

export interface AuthContext {
  decodedToken?: Payload;
  isAuth: boolean;
  error?: string;
}

export interface Payload extends jwt.JwtPayload {
  account: { _id: string; email: string } | null;
  user: { _id: string; role: number; email: string } | null;
}
```

**Context Data Source**

The `ContextDataSource` function is used to stringify and pass the Gateway `Context` to the external subgraphs.

File Upload support is also built in. The `ContextDataSource` extends the `FileUploadDataSource` provided by `@profusion/apollo-federation-upload`.

```ts
const gateway = new ApolloGateway({
  supergraphSdl,
  buildService({ url }) {
    const dataSource = new Helpers.Gateway.ContextDataSource({ url });
    return dataSource;
  },
});
```

### Subgraph Helpers

Helper Functions to use within federated micro-services/subgraphs.

**Generate Context**

In addition to Gateway Context Generation, this package provides a function to use when extracting `Context` from the Gateway, within a federated micro-service.

```ts
const apolloServer = new ApolloServer({
  schema: schema,
  context: ({ req }) => Helpers.Subgraph.GenerateContext({ req }),
});
```

At this point, additional "service specific" context can be injected, allowing the resolvers within the service to have access to the additional context.

```ts
const apolloServer = new ApolloServer({
  schema: schema,
  context: ({ req }) =>
    Helpers.Subgraph.GenerateContext({
      req,
      inject: { dogName: "Bongo", catName: "Oakley" },
    }),
});
```

Within the resolver, you can access the context passed from the gateway as well as the injected context.

```ts
const resolvers = {
  getDogs: (parent, args, context) => {
    const isAuthenticated = context.auth.isAuth;
    const dogName = context.dogName;
    const catName = context.catName;
  },
};
```

### Resolver Helpers

Functions to use at the resolver level of the federated service.

**CheckAuth**

Uses the `Context` provided by this package to limit resolver capabilities. This checks the `context.auth.isAuth` property to see if the request has been authenticated.

```ts
import { Helpers } from "@the-devoyage/micro-auth-helpers";

const resolvers = {
  getDogs: async (parent, args, context) => {
    Helpers.Resolver.CheckAuth({ context });

    // If auth fails, an auth error is thrown and the rest of the code will not be executed.
  },
};
```

The `context.auth` object has two levels of identification and authorization including `Account` and `User`.

```ts
export interface Payload extends jwt.JwtPayload {
  account: { _id: string; email: string } | null;
  user: { _id: string; role: number; email: string } | null;
}
```

Provide the `requireUser` or the `requireAccount` option to the `CheckAuth` function to require a user or account object to be present. If this is not present, only the `context.auth.isAuth` is needed to pass authentication.

```ts
Helpers.Resolver.CheckAuth({
  context,
  requireUser: true,
  requireAccount: true,
});
```

Pass custom error messages to override the default message if the `CheckAuth` function fails.

```ts
Helpers.Resolver.CheckAuth({
  context,
  errorMessage: "Sorry, you are not permitted to access this part of the API.",
});
```

**Limit Role**

Limit the API at a resolver level based on the user's role. All roles are of type number/int. Lower roles have higher permissions.

```ts
Helpers.Resolver.LimitRole({
  userRole: context.auth.user.role, // 10
  roleLimit: 1,
  errorMessage:
    "This is an optional error message, but you have been declined based on your role.",
});
```

**Create Activation Token**

This helper function creates an object of type `Activation` that can be saved to a database for custom validation. This uses dayjs to set the limit.

```ts
Helpers.Resolver.CreateActivationCode({
  codeLength: 6,
  codeLimit: { value: 6, unit: "hours" },
  //codeLimit: { value: 4, unit "h" },
  //codeLimit: { value: 1, unit "day" }
});
```

```ts
export type Activation = {
  code: string;
  limit: Scalars["DateTime"];
  verified: Scalars["Boolean"];
};
```

**Generate Token**

Use the `GenerateToken` function to generate a typed token that matches the typings of `Payload` from above.

```ts
const token = Helpers.Resolver.GenerateToken({
  secretOrPublicKey: process.env.JWT_ENCRYPTION_KEY,
  payload: {
    account: { _id: account._id, email: account.email },
    user: { _id: user._id, email: user.email, role: user.role },
    myCustomStuff: { include: "what you like" },
  },
  options: { expiresIn: "10h" },
});
```
