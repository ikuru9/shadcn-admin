import * as v from "valibot";

const userStatusSchema = v.union([
  v.literal("active"),
  v.literal("inactive"),
  v.literal("invited"),
  v.literal("suspended"),
]);
export type UserStatus = v.InferOutput<typeof userStatusSchema>;

const userRoleSchema = v.union([
  v.literal("superadmin"),
  v.literal("admin"),
  v.literal("cashier"),
  v.literal("manager"),
]);

const userSchema = v.object({
  id: v.string(),
  firstName: v.string(),
  lastName: v.string(),
  username: v.string(),
  email: v.string(),
  phoneNumber: v.string(),
  status: userStatusSchema,
  role: userRoleSchema,
  createdAt: v.pipe(
    v.string(),
    v.transform((x: string) => new Date(x)),
  ),
  updatedAt: v.pipe(
    v.string(),
    v.transform((x: string) => new Date(x)),
  ),
});
export type User = v.InferOutput<typeof userSchema>;

export const userListSchema = v.array(userSchema);
