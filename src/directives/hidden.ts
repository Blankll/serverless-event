import { filterSchema, mapSchema, MapperKind } from '@graphql-tools/utils';
import type { GraphQLSchema, ConstDirectiveNode, TypeDefinitionNode } from 'graphql';
import {
  TransformEnumValues,
  FilterObjectFieldDirectives,
  PruneSchema,
  wrapSchema,
} from '@graphql-tools/wrap';
const directiveName = 'hidden';
const shouldPreserveField = (
  hiddenDirective: ConstDirectiveNode | undefined,
  environment: string
) => {
  if (hiddenDirective === undefined) return true;

  const environmentsArg = hiddenDirective.arguments?.find(
    (argument) => argument.name.value === 'environments'
  );

  if (environmentsArg === undefined) {
    // `@hidden` without environments array means hidden in every environment
    return false;
  }
  const values = (environmentsArg.value as unknown as { values: Array<{ value: string }> }).values;
  return !values.some((val) => val.value === environment);
};

class RemoveHiddenElementsTransform {
  constructor(readonly environment: string) {}

  transformSchema(originalWrappingSchema: GraphQLSchema) {
    return filterSchema({
      schema: originalWrappingSchema,
      typeFilter: (typeName, type) => {
        const typeWithAst = type as {
          astNode?: TypeDefinitionNode;
        };

        // type is basic Scalar type like Boolean, Number, String
        if (typeWithAst.astNode === undefined) return true;

        const hiddenInDirective = typeWithAst.astNode.directives?.find(
          (directive) => directive.name.value === directiveName
        );

        return shouldPreserveField(hiddenInDirective, this.environment);
      },
      rootFieldFilter: (operationName, fieldName, fieldConfig) => {
        const hiddenInDirective = fieldConfig.astNode?.directives?.find(
          (directive) => directive.name.value === directiveName
        );
        return shouldPreserveField(hiddenInDirective, this.environment);
      },
      fieldFilter: (typeName, fieldName, fieldConfig) => {
        const hiddenInDirective = fieldConfig.astNode?.directives?.find(
          (directive) => directive.name.value === directiveName
        );
        return shouldPreserveField(hiddenInDirective, this.environment);
      },
      argumentFilter: (typeName, fieldName, argName, argumentConfig) => {
        if (argumentConfig === undefined) return true;

        if ((argumentConfig.astNode?.directives?.length ?? 0) === 0) return true;

        const hiddenInDirective = argumentConfig.astNode?.directives?.find(
          (directive) => directive.name.value === directiveName
        );

        return shouldPreserveField(hiddenInDirective, this.environment);
      },
    });
  }
}

export const hidden = (schema: GraphQLSchema, environment: string): GraphQLSchema =>
  mapSchema(
    wrapSchema({
      schema,
      transforms: [
        // remove any `ENUM_VALUE` satisfying `@hidden` from schema
        new TransformEnumValues((typeName, externalValue, enumValueConfig) => {
          const hiddenDirective = enumValueConfig.astNode?.directives?.find(
            (directive) => directive.name.value === directiveName
          );
          return shouldPreserveField(hiddenDirective, environment)
            ? [externalValue, enumValueConfig]
            : null;
        }),
        // remove any `SCALAR | OBJECT | FIELD_DEFINITION | ARGUMENT_DEFINITION | INTERFACE | UNION | ENUM | INPUT_OBJECT | INPUT_FIELD_DEFINITION` satisfying @hidden from schema
        new RemoveHiddenElementsTransform(environment),
        // remove any `@hidden` directive usages remaining in schema. For example if type Parity @hidden("partner") is still in schema after filtering, remove the @hidden("partner") declaration from schema
        new FilterObjectFieldDirectives((directiveName) => directiveName !== directiveName),
        // remove any unused Type Definition
        new PruneSchema({}),
      ],
    }),
    {
      // remove `@hidden` directive definition itself
      [MapperKind.DIRECTIVE]: (directive) => (directive.name === directiveName ? null : directive),
    }
  );
