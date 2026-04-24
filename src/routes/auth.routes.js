import express from "express";
import {
  login,
  register,
  createUserByAdmin,
  logout,
  refreshAccessToken
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema } from "../validators/auth.validator.js";

const router = express.Router();

//login and route
router.post("/login", login);

// public
router.post("/register", validate(registerSchema), register);

// 🔒 admin only
router.post("/create-user", verifyToken, allowRoles("AOT"), createUserByAdmin);

router.post("/logout", verifyToken, logout);

router.post("/refresh", refreshAccessToken);

export default router;
