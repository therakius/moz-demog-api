import express from "express";
import { createUser, emailForRecoverPassword, generateKey, resetPassword } from "../controllers/authController.js";

const router = express.Router()

router.post("/user-create", createUser)
router.post("/generate-key", generateKey)
router.post("/forgot-password", emailForRecoverPassword)
router.post("/reset-password", resetPassword)

export default router;