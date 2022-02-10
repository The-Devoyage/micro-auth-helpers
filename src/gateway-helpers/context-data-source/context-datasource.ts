import { GraphQLRequest } from "apollo-server-core";
import FileUploadDataSource from "@profusion/apollo-federation-upload";
import { Context } from "src/types";

export class ContextDataSource extends FileUploadDataSource {
  willSendRequest({
    request,
    context,
  }: {
    request: GraphQLRequest;
    context: Context | Record<string, any>;
  }) {
    request.http?.headers.set("context", JSON.stringify(context));
  }
}
