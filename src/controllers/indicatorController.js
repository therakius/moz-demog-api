import db from "../models/db.js";
import { make_response } from "../../utils.js";
import { makeIndicatorsQuery } from "../models/indicatorModel.js";
import { validateIndicatorsfields } from "../validators.js";

async function sendResponse(res, query, params = []) {
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
      data
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

export function getIndicators(req, res) {

  const isValid = validateIndicatorsfields(req)

  if(isValid){
    return res.status(400).json(isValid)
  }

  const {query, params}= makeIndicatorsQuery(req.query);
  
  sendResponse(res, query, params);
}
