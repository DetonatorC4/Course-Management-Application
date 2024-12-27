const { Router } = require("express");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { adminModel, courseModel } = require("../db");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");

const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
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
    await adminModel.create({
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });
    res.json({
      message: "Admin signed up",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "error occured while signing up",
      error: e.message,
    });
  }
});

adminRouter.post("/signin", async (req, res) => {
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

  const response = await adminModel.findOne({
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
      JWT_ADMIN_PASSWORD
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

adminRouter.post("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;

  const { title, description, imageUrl, price } = req.body;

  const course = await courseModel.create({
    title: title,
    description: description,
    imageUrl: imageUrl,
    price: price,
    creatorId: adminId,
  });

  res.json({
    message: "Course created",
    courseId: course._id,
  });
});

adminRouter.put("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;

  const { title, description, imageUrl, price, courseId } = req.body;

  const course = await courseModel.updateOne(
    { _id: courseId, creatorId: adminId },
    {
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price,
    }
  );

  res.json({
    message: "Course updated",
    courseId: course._id,
  });
});

adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
  const adminId = req.userId;

  const courses = await courseModel.find({
    creatorId: adminId,
  });

  res.json({
    courses,
  });
});

module.exports = {
  adminRouter: adminRouter,
};
