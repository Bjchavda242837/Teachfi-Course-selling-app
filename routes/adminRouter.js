const { Router } = require("express");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
const { adminModel, courseModel } = require("../db");
const bcrypt = require("bcrypt");
const {
  signupSchema,
  signinSchema,
  courseAddSchema,
  courseUpdateSchema
} = require("../routes/zodSchema");

const { adminAuth } = require('../middlewares/auth.middleware')

//signup route
adminRouter.post("/signup", async function (req, res) {
  try {
    //input validation from Zod
    const validation = signupSchema.safeParse(req.body);

    //validation check
    if (!validation.success) {
      return res.status(400).json({
        message: "validation failed",
        error: validation.error.issues.map((err) => ({
          message: err.message,
        })),
      });
    }

    //validated data from zod
    const { email, password, firstName, lastName } = validation.data;

    // password hashing
    const hashedpassword = await bcrypt.hash(password, 5);

    //save to mongodb
    await adminModel.create({
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
      message: "internal server error",
    });
  }
});

//signin route
adminRouter.post("/signin", async function (req, res) {
  try {
    // validate inputs
    const validation = signinSchema.safeParse(req.body);

    // validation check.
    if (!validation.success) {
      return res.status(400).json({
        message: "validation failed",
        error: validation.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    //validated data from zod
    const { email, password } = validation.data;

    //find user in mongo
    const user = await adminModel.findOne({ email });

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
      process.env.JWT_SECRET_ADMIN,
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

//course route
adminRouter.post("/course",adminAuth, async function (req, res) {
  try {
    //zod validation and validation check.
    const adminId = req.userId
    const validation = courseAddSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "validation error",
        error: validation.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    const { title, description, price, imageUrl } = validation.data;

    //save to mongo.
    await courseModel.create({
      title,
      description,
      price,
      imageUrl,
      creatorId : adminId
    });

    res.status(201).json({
      message: "course created",
    });
    console.log("course created");
  } catch (error) {
    console.log("course creating error: ", error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
});
//course-put route
adminRouter.put("/course",adminAuth, async function (req, res) {

   try {
    //zod validation and validation check.
    const adminId = req.userId
    const validation = courseUpdateSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "validation error",
        error: validation.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    const { title, description, price, imageUrl, courseId } = validation.data;

    //save to mongo.
    await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId,
    },{
      title,
      description,
      price,
      imageUrl,
    });

    res.status(201).json({
      message: "course updated",
    });
    console.log("course updated");
  } catch (error) {
    console.log("course updating error: ", error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
});
//course/bulk route
adminRouter.get("/course/bulk", adminAuth, async function (req, res) {
  try {
    const adminId = req.userId

    const courses = await courseModel.find({
      creatorId: adminId
    })

    
      return res.status(201).json({
        message: "here is course list",
        courses
      })
    
  } catch (error) {
    console.log("course fetching error: ", error);
    return res.status(500).json({
      message: "internal server error",
    });
  }
});

module.exports = {
  adminRouter: adminRouter,
};
