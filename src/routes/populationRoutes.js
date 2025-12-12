import express from "express"
import { getPopulationData } from "../controllers/populationController.js";

const router = express.Router()

router.get("/", getPopulationData)

export default router;