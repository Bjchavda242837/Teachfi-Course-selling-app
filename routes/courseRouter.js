const { Router } = require("express");
const courseRouter = Router();
const { userAuth } = require("../middlewares/userauth");
const { purchaseModel, courseModel } = require("../db");

//purchase router
courseRouter.post("/purchase", userAuth, async function (req, res) {
  const userId = req.userId;
  const courseId = req.body.courseId;

  await purchaseModel.create({
    userId,
    courseId,
  });

  res.json({
    message: "You have successfully bought the course",
  });
});

//preview router
courseRouter.get("/preview", async function (req, res) {
    const courses = await courseModel.find({})

    res.status(201).json({
        message: "all courses",
        courses,
    })
});

module.exports = {
  courseRouter: courseRouter,
};
