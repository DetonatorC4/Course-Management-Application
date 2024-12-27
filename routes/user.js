const { Router } = require("express");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userModel, purchaseModel, courseModel } = require("../db");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const requireBody = z.object({
    email: z.string().email().min(3).max(100),
    password: z.string().min(8).max(12),
    firstName: z.string().min(3).max(25),
    lastName: z.string().min(3).max(25),
  });

  const parsedWithSuccess = requireBody.safeParse(req.body);

  if (!parsedWithSuccess.success) {
    res.json({
      message: "Incorrect Format",
      error: parsedWithSuccess.error,
    });
    return;
  }

  const { email, password, firstName, lastName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 5);
    await userModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
    res.json({
      message: "User signed up",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "error occured while signing up",
      error: e.message,
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const requireBody = z.object({
    email: z.string().email().min(3).max(100),
    password: z.string().min(8).max(12),
  });

  const parsedWithSuccess = requireBody.safeParse(req.body);

  if (!parsedWithSuccess.success) {
    res.json({
      message: "Incorrect Format",
      error: parsedWithSuccess.error,
    });
    return;
  }

  const { email, password } = req.body;

  const response = await userModel.findOne({
    email: email,
  });

  if (!response) {
    res.status(403).json({
      message: "User dosen't exist",
    });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, response.password);

  if (response && passwordMatch) {
    const token = jwt.sign(
      {
        id: response._id.toString(),
      },
      JWT_USER_PASSWORD
    );
    res.json({
      token: token,
    });
  } else {
    res.status(403).json({
      message: "incorrect credentials",
    });
  }
});

userRouter.get("/purchases", userMiddleware, async (req, res) => {
  const userId = req.userId;

  const purchases = await purchaseModel.find({
    userId,
  });

  let purchasedCourseIds = [];

  for (let i = 0; i < purchases.length; i++) {
    purchasedCourseIds.push(purchases[i].courseId);
  }

  const coursesData = await courseModel.find({
    _id: { $in: purchasedCourseIds },
  });

  res.json({
    purchases,
    coursesData,
  });
});

module.exports = {
  userRouter: userRouter,
};
