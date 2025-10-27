import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { defaultFieldResolver, GraphQLError } from "graphql";

export const authDirectives = (schema) => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, "authenticated")?.[0];
      const requiresDirective = getDirective(schema, fieldConfig, "requiresScopes")?.[0];

      const { resolve = defaultFieldResolver } = fieldConfig;

      fieldConfig.resolve = async function (source, args, context, info) {
        const { user } = context;

        if (authDirective && !user) {
          throw new GraphQLError("Not authenticated", {
            extensions: { code: "UNAUTHENTICATED" },
          });
        }

        if (requiresDirective) {
          const requiredScopes = requiresDirective.scopes || [];
          if (!user) {
            throw new GraphQLError("Not authenticated", {
              extensions: { code: "UNAUTHENTICATED" },
            });
          }
          if (!requiredScopes.includes(user.role) && user.role !== "admin") {
            throw new GraphQLError("Forbidden: insufficient role", {
              extensions: { code: "FORBIDDEN" },
            });
          }
        }

        return resolve(source, args, context, info);
      };

      return fieldConfig;
    },
  });
};
