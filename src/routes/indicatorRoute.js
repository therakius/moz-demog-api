import express from "express"
import {getPopIndicators, getPopIndicatorsPerYear} from "../controllers/indicatorController.js"

const router = express.Router()

router.get("/", getPopIndicators)
router.get("/:year", getPopIndicatorsPerYear)

export default router; 
