import { toNestErrors, validateFieldsNatively } from "@hookform/resolvers";
import { appendErrors, type FieldError, type FieldValues, type Resolver } from "react-hook-form";

type ResolverMode = "async" | "sync";

type ZodMiniIssue = {
  code?: string;
  message: string;
  path: PropertyKey[];
  errors?: ZodMiniIssue[][];
  issues?: ZodMiniIssue[];
};

type ZodMiniSchema = {
  // biome-ignore lint/suspicious/noExplicitAny: schema boundary is dynamic by design
  safeParse: (...args: any[]) => any;
  // biome-ignore lint/suspicious/noExplicitAny: schema boundary is dynamic by design
  safeParseAsync: (...args: any[]) => Promise<any>;
};

type ResolverOptions = {
  mode?: ResolverMode;
  raw?: boolean;
};

function isSuccess(result: any): result is { success: true; data: any } {
  return result.success === true;
}

function isZodMiniSchema(schema: unknown): schema is ZodMiniSchema {
  return typeof schema === "object" && schema !== null && "safeParse" in schema && "safeParseAsync" in schema;
}

function flattenIssues(issues: ZodMiniIssue[], basePath: PropertyKey[] = []): ZodMiniIssue[] {
  const flat: ZodMiniIssue[] = [];

  for (const issue of issues) {
    const path = [...basePath, ...issue.path];

    if (issue.code === "invalid_union" && issue.errors) {
      flat.push({ ...issue, path });

      for (const group of issue.errors) {
        flat.push(...flattenIssues(group, path));
      }

      continue;
    }

    if (issue.issues) {
      flat.push({ ...issue, path });
      flat.push(...flattenIssues(issue.issues, path));
      continue;
    }

    flat.push({ ...issue, path });
  }

  return flat;
}

function parseIssues(issues: ZodMiniIssue[], validateAllFieldCriteria: boolean) {
  const errors: Record<string, FieldError> = {};

  for (const issue of flattenIssues(issues)) {
    const path = issue.path.map(String).join(".");

    if (!path) {
      continue;
    }

    if (!errors[path]) {
      errors[path] = { message: issue.message, type: issue.code ?? "custom" };
    }

    if (validateAllFieldCriteria) {
      const types = errors[path].types;
      const messages = types && types[issue.code ?? "custom"];

      errors[path] = appendErrors(
        path,
        validateAllFieldCriteria,
        errors,
        issue.code ?? "custom",
        messages ? ([] as string[]).concat(messages as string[], issue.message) : issue.message,
      ) as FieldError;
    }
  }

  return errors;
}

/**
 * Creates a React Hook Form resolver for Zod Mini schemas.
 *
 * @param schema - Zod Mini schema.
 * @param schemaOptions - Reserved for API parity.
 * @param resolverOptions - Optional resolver-specific behavior.
 * @returns RHF resolver compatible with Zod Mini validation results.
 */
export function zodMiniResolver<Input extends FieldValues, Context, Output>(
  schema: ZodMiniSchema,
  schemaOptions?: unknown,
  resolverOptions: ResolverOptions = {},
): Resolver<Input, Context, Output | Input> {
  return async (values: Input, _, options) => {
    if (!isZodMiniSchema(schema)) {
      throw new Error("Invalid input: not a Zod Mini schema");
    }

    const result =
      resolverOptions.mode === "sync"
        ? schema.safeParse(values, schemaOptions)
        : await schema.safeParseAsync(values, schemaOptions);

    if (isSuccess(result)) {
      if (options.shouldUseNativeValidation) {
        validateFieldsNatively({}, options);
      }

      return {
        errors: {},
        values: resolverOptions.raw ? Object.assign({}, values) : result.data,
      };
    }

    return {
      values: {},
      errors: toNestErrors(
        parseIssues(
          result.error.issues as ZodMiniIssue[],
          !options.shouldUseNativeValidation && options.criteriaMode === "all",
        ),
        options,
      ),
    };
  };
}
