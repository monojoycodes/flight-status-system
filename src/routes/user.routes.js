import express from "express";
import { register } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
    "/",
    verifyToken,
    allowRoles("AOT"),
    register
)

export default router;