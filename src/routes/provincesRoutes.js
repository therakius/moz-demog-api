import express from "express";
import { getProvinces, getProvincesByName, percentualStructureByProvinceName,
perThousandByProvinceName, getProvincesbyYear,
getAvailableYears
} from "../controllers/provincesController.js";

const router = express.Router();
router.get("/years", getAvailableYears)
router.get("/:name/percentual-structure", percentualStructureByProvinceName);
router.get("/:name", getProvincesByName);
router.get("/year/:year", getProvincesbyYear);
router.get("/:name/per-thousand", perThousandByProvinceName );
router.get("/", getProvinces);


export default router;