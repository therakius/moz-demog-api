import express from "express";
import { getProvinces, getProvincesByName } from "../controllers/provincesController.js";

const router = express.Router();

router.get("/", getProvinces);

router.get("/:name", getProvincesByName);

export default router;