import express from "express"
import {getPopIndicators, getPopIndicatorsPerYear, dependencyRate} from "../controllers/indicatorController.js"

const router = express.Router()

router.get("/dependency-rate", dependencyRate)
router.get("/:year", getPopIndicatorsPerYear)
router.get("/", getPopIndicators)


export default router; 
