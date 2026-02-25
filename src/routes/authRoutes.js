import express from "express";
import { createUser, emailForRecoverPassword, generateKey } from "../controllers/authController.js";

const router = express.Router()

router.post("/user-create", createUser)
router.post("/generate-key", generateKey)
router.post("/forgot-password", emailForRecoverPassword)

export default router;