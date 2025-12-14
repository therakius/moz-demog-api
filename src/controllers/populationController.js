import db from "../models/db.js";
import { make_response } from "../../utils.js";

async function sendResponse(res, query, params = []) {
    try {
        const result = await db.query(query, params);
        const rows = result.rows
        let data = []

        if (!rows.length) {
            return res.status(404).json(make_response(false, 404, "No records found.", [], {}));
        }

        for (let i in rows){
            data.push(rows[i].data)
        }

        const response = make_response(true, 200, "Population data retrieved successfully.", [], data)

        res.status(200).json(response)
    } catch (error) {
        console.error(error);
        res.status(500).json(make_response(false, 500, "An error occured while trying to retrieve info.", [], []));
    }
};



export async function getPopulationData(req, res) {
    try {
        const { year, p_name, field } = req.query;


        if (year && Number(year) !== 2023) {
            return res.status(400).json(
                make_response(false, 400, "Only population data from 2023 is available", { year }, {})
            );
        }


        const allowedFields = ["p_thousand", "p_structure"];
        let selectedField = null;

        if (field) {
            if (!allowedFields.includes(field)) {
                return res.status(400).json(
                    make_response(false, 400, "Invalid field filter", { field }, {})
                );
            }
            selectedField = field;
        }


        let selectFields = `
            'year', y.year,
            'province_name', p.province_name, 'population_density', p.population_density,
            'population_per_thousand',
                JSON_BUILD_OBJECT(
                    'total', ppt.per_thousand_total,
                    'male', ppt.per_thousand_male,
                    'female', ppt.per_thousand_female
                ),
            'percentual_structure',
                JSON_BUILD_OBJECT(
                    'percentual_total', pps.total,
                    'percentual_male', pps.male_population,
                    'percentual_female', pps.female_population
                )
        `;

        if (selectedField === "p_thousand") {
            selectFields = `
                'year', y.year,
                'province_name', p.province_name,
                'population_per_thousand',
                    JSON_BUILD_OBJECT(
                        'total', ppt.per_thousand_total,
                        'male', ppt.per_thousand_male,
                        'female', ppt.per_thousand_female
                    )
            `;
        } else if (selectedField === "p_structure") {
            selectFields = `
                'year', y.year,
                'province_name', p.province_name,
                'percentual_structure',
                    JSON_BUILD_OBJECT(
                        'percentual_total', pps.total,
                        'percentual_male', pps.male_population,
                        'percentual_female', pps.female_population
                    )
            `;
        }

        let query = `
            SELECT JSON_BUILD_OBJECT(${selectFields}) AS data
            FROM public.year y
            INNER JOIN provinces p ON p.year_id = y.id
            INNER JOIN population_per_thousand ppt ON ppt.province_id = p.id
            INNER JOIN population_percentual_structure pps ON pps.province_id = p.id
            WHERE 1 = 1
        `;


        let params = [];
        let idx = 1;

        if (year) {
            query += ` AND y.year = $${idx}`;
            params.push(year);
            idx++;
        }

        if (p_name) {
            query += ` AND LOWER(p.province_name) = LOWER($${idx})`;
            params.push(p_name);
            idx++;
        }


        return sendResponse(res, query, params);

    } catch (error) {
        console.error("Error in getPopulationData:", error);
        return res.status(500).json(
            make_response(false, 500, "Internal server error", {}, { error: error.message })
        );
    }
}
