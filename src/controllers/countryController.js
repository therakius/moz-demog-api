import db from "../models/db.js";
import {make_response} from "../../utils.js"

async function sendResponse(res, query, params = []) {
    try {
        const result = await db.query(query, params);
        const rows = result.rows

        if (!rows.length) {
            return res.status(404).json(make_response(false, 200, "No records found", [], {}));
        }

        const response = make_response(true, 200, "General country informations found successfully", [], rows[0]?.data)

        res.status(200).json(response)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export async function getCountry(req, res){
    const date = new Date();
    const currentYear = date.getFullYear();
    const year = req.query.year || currentYear;
    
    const query = `
        SELECT
            JSON_BUILD_OBJECT(
                    'country_name',
                    'mozambique',
                    'current_president', (select Y.HEAD_OF_STATE from public.year y where y.year = ${year}),
                    'area',
                    CD.TOTAL_AREA_SQKM,
                    'capital_city',
                    CD.CAPITAL_CITY,
                    'independence_date',
                    CD.INDEPENDENCE_DATE,
                    'official_language',
                    CD.OFFICIAL_LANGUAGE
            ) as data
        FROM
            COUNTRY_DATA AS CD
    `;

    sendResponse(res, query);
}