const { Router } = require("express");
const jwt = require("jsonwebtoken");
const userRouter = Router();
const { userModel, courseModel } = require("../db");
const { z, email } = require("zod");
const bcrypt = require("bcrypt");

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

userRouter.post("/signup", async function (req, res) {
  //input validation from Zod
  const validation = signupSchema.safeParse(req.body);

  //validation check
  if (!validation.success) {
    return res.status(400).json({
      message: "validation failed",

      error: validation.error.issues.map((err) => {
        message: err.message;
      }),
    });
  }

  //validated data from zod
  const { email, password, firstName, lastName } = validation.data;

  // password hashing
  const hashedpassword = await bcrypt.hash(password, 5);

  //save to mongodb
  try {
    await userModel.create({
      email: email,
      password: hashedpassword,
      firstName: firstName,
      lastName: lastName,
    });

    res.status(201).json({
      message: "You are signed up",
    });
  } catch (error) {
    return res.status(400).json({
      message: "signup Failed",
      error: error.message,
    });
  }

  console.log("you are signed up");
});

userRouter.post("/signin", async function (req, res) {
  try {
    // validate inputs
    const validation = signinSchema.safeParse(req.body);

    // validation check.
    if (!validation.success) {
      return res.status(400).json({
        message: "validation failed",
        error: validation.error.issues.map((err) => {
          message: err.message;
        }),
      });
    }

    //validated data from zod

    const { email, password } = validation.data;

    //find user in mongo
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(403).json({
        message: "invalid credentials",
      });
    }

    // compare data ( user data with mongo data )
    const iMatch = await bcrypt.compare(password, user.password);

    if (!iMatch) {
      return res.status(403).json({
        message: "invalid credentials",
      });
    }

    //generate jwt token.
    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      process.env.JWT_SECRET_USER,
    );

    return res.status(200).json({
      message: "Signed in successfully",
      token: token,
    });
  } catch (error) {
    console.log("signin error", error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
});

userRouter.post("/purchase", function (req, res) {});

module.exports = {
  userRouter: userRouter,
};
