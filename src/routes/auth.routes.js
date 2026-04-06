import express from "express"
import { login, register, createUserByAdmin } from "../controllers/auth.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

//login and route
router.post("/login", login);

// public
router.post("/register", register);

// 🔒 admin only
router.post(
  "/create-user",
  verifyToken,
  allowRoles("AOT"),
  createUserByAdmin
)

export default router