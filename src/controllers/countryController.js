import db from "../models/db.js";
import {make_response} from "../../utils.js"
import { makeCountryQuery } from "../models/countryModel.js";

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

    const query = makeCountryQuery(year)

    sendResponse(res, query);
}