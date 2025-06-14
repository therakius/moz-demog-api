import express from "express"
import {getAllCountryData} from "../controllers/countryController.js";

const router = express.Router();

router.get("/", getAllCountryData)

export default router;