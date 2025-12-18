import db from "../models/db.js";
import { make_response } from "../../utils.js";
import { getPopulationQuery, makePopulationCountQuery } from "../models/populationModel.js";
import { validatePopulationFields } from "../validators.js";
import { paginateResults } from "../paginator.js";
async function sendResponse(res, query, params = [], paginated) {
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
      data, paginated
    );

    res.status(200).json(response);
  } catch (error) {
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
  let { page, per_page } = req.query;

  const validData = await validatePopulationFields(req);

  if (validData) {
    return res.status(400).json(validData);
  }

  page = parseInt(page);
  per_page = parseInt(per_page);

  if (!page || page < 1) page = 1;
  if (!per_page || per_page < 1) per_page = 5;

  const offset = (page - 1) * per_page;


  const { pQueryC, pParamsC } = makePopulationCountQuery(req);

  const totalCount = await countPopulation(pQueryC, pParamsC);

  if (totalCount === "error") {
    return res
      .status(500)
      .json(
        make_response(false, 500, "Ther was an internal server error", {}, {})
      );
  }

  const paginated = paginateResults(page, per_page, totalCount);


  const { query, params } = getPopulationQuery(req.query, per_page, offset);

  return sendResponse(res, query, params, paginated);
}

async function countPopulation(query, params) {
  try {
    const result = await db.query(query, params)
    return result.rows[0].total

  } catch (error) {
    return "error"
  }
}
