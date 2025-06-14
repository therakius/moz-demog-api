import express from "express";
import { getProvinces, getProvincesByName, percentualStructureByProvinceName } from "../controllers/provincesController.js";

const router = express.Router();

router.get("/:name", getProvincesByName);
router.get("/:name/percentual-structure", percentualStructureByProvinceName );
router.get("/", getProvinces);


export default router;