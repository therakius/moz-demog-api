import db from "../models/db.js";
import { make_response } from "../../utils.js";
import {
  getProvinceListQuery,
  getProvinceQuery,
  getProvincesForValidate,
} from "../models/provinceModel.js";

async function sendResponse(res, query, params = []) {
  try {
    const result = await db.query(query, params);

    if (!result.rows.length) {
      return res
        .status(404)
        .json(make_response(false, 404, "No records found."));
    }

    let result_final = [];

    result.rows.forEach((r) => {
      result_final.push(r.data);
    });

    const data = result_final;

    res
      .status(200)
      .json(
        make_response(true, 200, "information found successfuly", [], data)
      );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getProvinces(req, res) {
  const { query, params } = getProvinceQuery(req.query);

  sendResponse(res, query, params);
}

export function getProvinceList(req, res) {
  const query = getProvinceListQuery();

  sendResponse(res, query);
}

export function provincesQuery(province) {
  const { query, params } = getProvincesForValidate(province);

  return listOfProvinces(query, params);
}

async function listOfProvinces(query, params) {
  try {
    const result = await db.query(query, params);

    console.log(result.rowCount);
    if (result.rowCount == 0) return 0;

    return 1;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}
