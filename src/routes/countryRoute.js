import express from "express"
import {getCountry} from "../controllers/countryController.js";
import { getIndicators } from "../controllers/indicatorController.js";

const router = express.Router();

router.get("/basic-info", getCountry)

export default router;