import express from "express"
import {getCountry} from "../controllers/countryController.js";

const router = express.Router();

router.get("/", getCountry)

export default router;