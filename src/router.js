import express from "express";
import user from "./controller/user.js"

const router = express.Router();

router.use('/users', user);

router.use('*', (req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

export default router;