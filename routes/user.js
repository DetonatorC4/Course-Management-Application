const { Router } = require("express");

const userRouter = Router();

userRouter.post("/signup", (req, res) => {
  res.json({
    message: "user signup endpoint",
  });
});

userRouter.post("/signin", (req, res) => {
  res.json({
    message: "user signin endpoint",
  });
});

userRouter.get("/purchases", (req, res) => {
  res.json({
    message: "user purchases endpoint",
  });
});

module.exports = {
  userRouter: userRouter,
};
