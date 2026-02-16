import express from "express";
import { createUser } from "../controllers/authController.js";

const router = express.Router()

router.post("/user", createUser)

export default router;