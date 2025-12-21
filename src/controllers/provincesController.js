import db from "../models/db.js";
import { make_response } from "../../utils.js";
import {
  getProvinceListQuery,
  getProvinceQuery,
  getProvincesForValidate,
  getProvinceCountQuery
} from "../models/provinceModel.js";
import { validateprovincesField, validatePaginationInputs } from "../validators.js";

import { paginateResults } from "../paginator.js";

async function sendResponse(res, query, params = [], paginated) {
  try {
    const result = await db.query(query, params);

    if (!result.rows.length) {
      return res
        .status(404)
        .json(make_response(false, 404, "No records found."));
    }

    let result_final = {};

    result.rows.forEach((r) => {
      result_final.provinces = r.data.provinces;
    });

    const data = result_final;

    res
      .status(200)
      .json(
        make_response(true, 200, "information found successfuly", [], data, paginated)
      );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getProvinces(req, res) {

    let { page, per_page } = req.query;
  
    const validPaginateParams = validatePaginationInputs(page, per_page)
  
    if (validPaginateParams) {
      return res.status(400).json(validPaginateParams)
    } 

  const isValid = await validateprovincesField(req);

  if (isValid) {
    return res.status(400).json(isValid);
  }

  page = parseInt(page);
  per_page = parseInt(per_page);

  if(!page || page < 1) page = 1;

  if(!per_page || per_page < 1) per_page = 5;

  const offset = (page - 1) * per_page;

  const {pQueryCount, pQueryParams} =  getProvinceCountQuery(req)

  const totalCount = await countProvinceRecords(pQueryCount, pQueryParams)

  if (totalCount === "error"){

    return res.status(500).json(make_response(false, 500, "There was an internal server error.", {}, {}))
  }

  const paginated = paginateResults(page, per_page, totalCount)

  const { query, params } = getProvinceQuery(req.query, per_page, offset);

  sendResponse(res, query, params, paginated);
}


async function countProvinceRecords(query, params){
  try {
    const result = await db.query(query, params)

    return result.rows[0].total
  } catch (error) {
    return "error"
  }
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

    if (result.rowCount == 0) return 0;

    return 1;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
}
