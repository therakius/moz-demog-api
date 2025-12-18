import db from "../models/db.js";
import { make_response } from "../../utils.js";
import {
  makeIndicatorsCountQuery,
  makeIndicatorsQuery,
} from "../models/indicatorModel.js";
import { validateIndicatorsfields } from "../validators.js";
import { paginateResults } from "../paginator.js";

async function sendResponse(res, query, params = [], paginate) {
  try {
    const result = await db.query(query, params);
    const rows = result.rows;
    let data = [];

    if (!rows.length) {
      return res
        .status(404)
        .json(
          make_response(
            false,
            404,
            "No records found with the provided filters",
            [],
            {}
          )
        );
    }

    rows.forEach((r) => {
      data.push(r.data);
    });

    const response = make_response(
      true,
      200,
      "Population indicators data retrieved successfully.",
      [],
      data,
      paginate
    );

    res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json(
        make_response(
          false,
          500,
          "An error occured while trying to retrieve info.",
          { error: error.message }
        )
      );
  }
}

export async function getIndicators(req, res) {
  const isValid = validateIndicatorsfields(req);

  if (isValid) {
    return res.status(400).json(isValid);
  }

  let { page, per_page } = req.query;

  page = parseInt(page);
  per_page = parseInt(per_page);

  if (!page || page < 1) page = 1;
  if (!per_page || per_page < 1) per_page = 5;

  const offset = (page - 1) * per_page;

  const { iQueryC, iParamsC } = makeIndicatorsCountQuery(req);

  const totalCount = await countIndicators(iQueryC, iParamsC);

  if (totalCount === "error") {
    return res
      .status(500)
      .json(
        make_response(false, 500, "Ther was an internal server error", {}, {})
      );
  }

  const paginated = paginateResults(page, per_page, totalCount);

  const { query, params } = makeIndicatorsQuery(req.query, per_page, offset);

  sendResponse(res, query, params, paginated);
}

async function countIndicators(query, params) {
  try {
    const totalCount = await db.query(query, params);

    return totalCount.rows[0].total;
  } catch (error) {
    return "error";
  }
}
