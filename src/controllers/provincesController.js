import db from "../models/db.js";
import { make_response } from "../../utils.js";

async function sendResponse(res, query, params = []) {
  try {
    const result = await db.query(query, params);

    if (!result.rows.length) {
      return res
        .status(404)
        .json(make_response(false, 404, "No records found."));
    }

    let result_final = []

    result.rows.forEach(r => {
        result_final.push(r.data)
    })
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
  let p_name = req.query.p_name;

  let whereClause = "";
  let params = []
  let query = `
        select json_build_object(
        'year', y.year,
        'province_name', p.province_name,
        'population_density', p.population_density,
        'area_in_sqkm', p.area_in_sqkm,
        'data_state', y.data_state
        ) as data
        from provinces p
        inner join year y on y.id = p.year_id
        where 1 = 1   
    `;

  if (p_name) {
    p_name = p_name.toLowerCase();

    whereClause+= ` and lower(p.province_name) = $1`
    params.push(p_name)
    query += whereClause
  }

  sendResponse(res, query, params);
}

export function getProvinceList(req, res){
    const query = `select json_build_object(
	'provinces', json_agg(province_name) ) data
	from provinces`

    sendResponse(res, query)
}