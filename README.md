# The Devoyage - Micro Auth Helpers

A collection of functions to make life easier when dealing with authentication and authorization within a Federated Apollo Microservice Architecture.

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

Helper functions to use within the Gateway Service.

**Generate Context**

Creates context at the gateway level based on the incoming request headers or custom "injected" (see below) data.

By default, no headers are included. Instruct `GenerateContext` to include headers by passing header keys in the `headers` array.

`Authorization` headers are assumed to be JSON web tokens and are automatically decoded -- if the secretOrPublicKey is provided. For example: `Authorization: Bearer ${token}`

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
        inject: { customKey: customContext }
      });
    },
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}

startServer();

app.listen(port, () => console.log(`GATEWAY ====> UP ON PORT ${port}`));
```

The generate function returns type `Context` to be passed to external services. It always includes the `auth` context in addition to any other headers that you have instructed it to provide.

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

**Context Data Source**

The `ContextDataSource` function is used to stringify and pass the Gateway `Context` to the external micro services.

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
  context: ({ req }) => Helpers.Service.GenerateContext({ req }),
});
```

At this point, additional "service specific" context can be injected, allowing the resolvers within the service to have access to the additional context.

```ts
const apolloServer = new ApolloServer({
  schema: schema,
  context: ({ req }) =>
    Helpers.Service.GenerateContext({
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

Uses the `Context` provided by this package to limit resolver capabilities.

```ts
import { Helpers } from "@the-devoyage/micro-auth-helpers";

const resolvers = {
  getDogs: async (parent, args, context) => {
    Helpers.Resolver.CheckAuth({ context });

    // If auth fails, an auth error is thrown and the rest of the code will not be executed.
  },
};
```

The `Context` object has two levels of identification and authorization including `Account` and `User`.

```ts
export interface DecodedToken extends jwt.JwtPayload {
  account?: { _id: string; email: string };
  user?: { _id: string; role: number; email: string };
}
```

Provide the `requireUser` option to the `CheckAuth` function to require a user object to be present. If this is not present, only the `context.auth.isAuth` is needed to pass authentication.

```ts
Helpers.Resolver.CheckAuth({ context, requireUser: true });
```

Pass custom error messages to override the default message if the `CheckAuth` function fails.

```ts
Helpers.Resolver.CheckAuth({
  context,
  errorMessage: "Sorry, you are not permitted to access this part of the API.",
});
```

**Limit Role**

Limit the API at a resolver level based on the user's role. All roles are numbers.

```ts
Helpers.Resolver.LimitRole({
  userRole: context.auth.user.role,
  roleLimit: 1,
  errorMessage:
    "This is an optional error message, but you have been declined based on your role.",
});
```

**Create Activation Token**

This helper function creates an object of type `Activation` that can be saved to a database for custom validation. This uses dayjs under the hood.

```ts
Helpers.Resolver.CreateActivationCode({
  codeLength: 6,
  codeLimit: { value: 6, unit: "hours" },
  //codeLimit: { value: 4, unit "h" },
  //codeLimit: { value: 1, unit "day" }
});
```
