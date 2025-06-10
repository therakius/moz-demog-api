import express from "express";
import { getProvinces } from "../controllers/provincesController.js";

const router = express.Router();

router.get("/", getProvinces);

export default router;