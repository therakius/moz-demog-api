import express from "express"
import {getAllCountryData, getCountryData, getCountryDataPerYear} from "../controllers/countryController.js";

const router = express.Router();

router.get("/all", getAllCountryData)
router.get("/", getCountryData)
router.get("/:year", getCountryDataPerYear)

export default router;