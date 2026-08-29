const { Router } = require("express");
const courseRouter = Router();
const { userAuth } = require("../middlewares/userauth");
const { purchaseModel } = require("../db");

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
courseRouter.get("/preview", function (req, res) {});

module.exports = {
  courseRouter: courseRouter,
};
