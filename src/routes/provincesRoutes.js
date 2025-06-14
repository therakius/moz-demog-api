import express from "express";
import { getProvinces, getProvincesByName, percentualStructureByProvinceName,
perThousandByProvinceName
} from "../controllers/provincesController.js";

const router = express.Router();

router.get("/:name", getProvincesByName);
router.get("/:name/percentual-structure", percentualStructureByProvinceName);
router.get("/:name/per-thousand", perThousandByProvinceName );
router.get("/", getProvinces);


export default router;