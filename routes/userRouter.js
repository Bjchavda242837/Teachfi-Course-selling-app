const { Router } = require("express");
const jwt = require("jsonwebtoken");
const userRouter = Router();
const { userModel, courseModel } = require("../db");
const { z, email } = require("zod");
const bcrypt = require("bcrypt");
const { signupSchema, signinSchema } = require("../routes/zodSchema");

userRouter.post("/signup", async function (req, res) {
  try {
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
    await userModel.create({
      email: email,
      password: hashedpassword,
      firstName: firstName,
      lastName: lastName,
    });

    res.status(201).json({
      message: "You are signed up",
    });
    console.log("you are signed up");

  } catch (error) {
    console.log("signup-user error", error);
    return res.status(500).json({
      message: 'internal server error'
    })
  }
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

userRouter.post("/purchase", function (req, res) {
  
});

module.exports = {
  userRouter: userRouter,
};
