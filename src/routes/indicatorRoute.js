import express from "express"
import {getPopIndicators, getPopIndicatorsPerYear, dependencyRate, 
dependencyRatePerYear, lifeExpectancy, lifeExpectancyPerYear, infantMortality, 
infantMortalityPerYear} from "../controllers/indicatorController.js"

const router = express.Router()

router.get("/dependency-rate", dependencyRate)
router.get("/life-expectancy", lifeExpectancy)
router.get("/infant-mortality", infantMortality)
router.get("/infant-mortality/:year", infantMortalityPerYear)
router.get("/life-expectancy/:year", lifeExpectancyPerYear)
router.get("/dependency-rate/:year", dependencyRatePerYear)
router.get("/:year", getPopIndicatorsPerYear)
router.get("/", getPopIndicators)


export default router; 
