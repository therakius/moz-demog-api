import db from "../models/db.js";
import { make_response } from "../../utils.js";
import { json } from "stream/consumers";

async function sendResponse(res, query, params = []) {
    try {
        const result = await db.query(query, params);
        const rows = result.rows
        let data = []

        if (!rows.length) {
            return res.status(404).json(make_response(false, 404, "No records found with the provided filters", [], {}));
        }
        
        rows.forEach(r=>{
            data.push(r.data)
        })

        const response = make_response(true, 200, "Population indicators data retrieved successfully.", [], data)

        res.status(200).json(response)
    } catch (error) {
        console.error(error.message);
        res.status(500).json(make_response(false, 500, "An error occured while trying to retrieve info.", {"error": error.message}));
    }
};

export function getIndicators(req, res) {

    let {y_start, y_end, fields} = req.query;

    console.log(y_start, y_end, fields)
    const allowedFields = ["p_thousand","d_rate","l_expectancy","i_mortality"]

    let query = ""
    let extras = []
    let fromWhere = `as data
        FROM
                PUBLIC.YEAR Y
            INNER JOIN COUNTRY_POP_INDICATORS CPI ON CPI.YEAR_ID = Y.ID
            INNER JOIN DEPENDENCY_RATE DR ON DR.YEAR_ID = Y.ID
            INNER JOIN LIFE_EXPECTANCY_AT_BIRTH LEB ON LEB.YEAR_ID = Y.ID
            INNER JOIN INFANT_MORTALITY IM ON IM.YEAR_ID = Y.ID
            WHERE 1 = 1
    `

    if(!y_start && !y_end && !fields){
        query = `
            SELECT 
            JSON_BUILD_OBJECT(

                -- bloco principal
                'year', Y.YEAR,
                'total_population', CPI.TOTAL_POPULATION,
                'male', CPI.MALE_POPULATION,
                'female', CPI.FEMALE_POPULATION,
                'urban_percent', CPI.URBAN_PERCENTUAL,
                'sex_raio', CPI.SEX_RATIO,
                'median_age', CPI.MEDIAN_AGE,
                'gross_birth_rate', CPI.GROSS_BIRTH_RATE,
                'gross_mortality_rate', CPI.GROSS_MORTALITY_RATE,
                'growth_rate', CPI.GROWTH_RATE,

                -- dependency_rate
                'dependency_rate',
                    JSON_BUILD_OBJECT(
                        'total', DR.TOTAL,
                        'young', DR.YOUNG
                    ),

                -- life_expectancy_at_birth
                'life_expectancy_at_birth',
                    JSON_BUILD_OBJECT(
                        'average', LEB.AVERAGE_LIFE_EXPECTANCY,
                        'male', LEB.MALE_LIFE_EXPECTANCY,
                        'female', LEB.FEMALE_LIFE_EXPECTANCY
                    ),

                -- infant_mortality
                'infant_mortality',
                    JSON_BUILD_OBJECT(
                        'average', IM.AVERAGE_infant_mortality,
                        'male', IM.MALE_infant_mortality,
                        'female', IM.FEMALE_infant_mortality
                    )

            ) AS data
        ${fromWhere}
        `
    }

    
    if (fields){
        fields = JSON.parse(fields)
        console.log(typeof(fields))
        fields.forEach(field => {
            query= `
                SELECT 
                    JSON_BUILD_OBJECT(
         
                `

            if (field ==="p_thousand") {
                extras.push(`'year', Y.YEAR,'total_population', CPI.TOTAL_POPULATION,'male', CPI.MALE_POPULATION,'female', CPI.FEMALE_POPULATION,'urban_percent', CPI.URBAN_PERCENTUAL,'sex_raio', CPI.SEX_RATIO,'median_age', CPI.MEDIAN_AGE,'gross_birth_rate', CPI.GROSS_BIRTH_RATE,'gross_mortality_rate', CPI.GROSS_MORTALITY_RATE,'growth_rate', CPI.GROWTH_RATE`)
            }
            if (field ==="d_rate"){
                extras.push(`'dependency_rate', JSON_BUILD_OBJECT('total', DR.TOTAL, 'young', DR.YOUNG)`)
            }

            if (field =="l_expectancy") {
                extras.push(`'life_expectancy',JSON_BUILD_OBJECT('average', LEB.AVERAGE_LIFE_EXPECTANCY,'male', LEB.MALE_LIFE_EXPECTANCY,'female', LEB.FEMALE_LIFE_EXPECTANCY)`)
            }

            if (field ==="i_mortality") {
                extras.push(`'infant_mortality', JSON_BUILD_OBJECT('average', IM.AVERAGE_infant_mortality,'male', IM.MALE_infant_mortality,'female', IM.FEMALE_infant_mortality)`)
            }
        });

        extras = extras.join(", ")
        extras += ")"
        query += extras
    }

    query+=fromWhere


sendResponse(res, query)
}