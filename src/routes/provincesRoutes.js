import express from "express";
import { getProvinces, getProvinceList} from "../controllers/provincesController.js";

const router = express.Router();
router.get("/list", getProvinceList)
router.get("/", getProvinces);

export default router;