const { z, email } = require("zod");


// Zod Signup Schema
const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "password must be atleast 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "password must contain at least one number"),
  firstName: z.string().max(30),
  lastName: z.string().max(30),
});

// zod signin schema.
const signinSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "password must be atleast 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "password must contain at least one number"),
});


module.exports = {
    signupSchema,
    signinSchema
}