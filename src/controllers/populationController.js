import db from "../models/db.js";
import { make_response } from "../../utils.js";
import { getPopulationQuery } from "../models/populationModel.js";
import { validatePopulationFields } from "../validators.js";

async function sendResponse(res, query, params = []) {
  try {
    const result = await db.query(query, params);
    const rows = result.rows;
    let data = [];

    if (!rows.length) {
      return res
        .status(404)
        .json(make_response(false, 404, "No records found.", [], {}));
    }

    for (let i in rows) {
      data.push(rows[i].data);
    }

    const response = make_response(
      true,
      200,
      "Population data retrieved successfully.",
      [],
      data
    );

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        make_response(
          false,
          500,
          "An error occured while trying to retrieve info.",
          [],
          []
        )
      );
  }
}

export async function getPopulationData(req, res) {
  
  const validData = await validatePopulationFields(req)
  
  console.log(validData)

  if (validData) {
    return res.status(400).json(validData)
  }

  const { query, params } = getPopulationQuery(req.query);

  return sendResponse(res, query, params);
}
