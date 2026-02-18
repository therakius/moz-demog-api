import express from "express";
import { createUser, generateKey } from "../controllers/authController.js";

const router = express.Router()

router.post("/user", createUser)
router.post("/keygen", generateKey)

export default router;