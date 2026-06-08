import express from "express";
import {getProvinceList} from "../controllers/provincesController.js";

const router = express.Router();
router.get("/", getProvinceList);

export default router;