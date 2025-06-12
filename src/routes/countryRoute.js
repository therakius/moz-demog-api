import express from "express"
import {getCountryData} from "../controllers/countryController.js";

const router = express.Router();

router.get("/", getCountryData)

export default router;