import express from "express";
import {getProvinceList, getProvinces} from "../controllers/provincesController.js";

const router = express.Router();
router.get("/info", getProvinces)
router.get("/", getProvinceList);

export default router;