import express from "express"
import {getAllCountryData, getCountryData} from "../controllers/countryController.js";

const router = express.Router();

router.get("/all", getAllCountryData)
router.get("/", getCountryData)

export default router;