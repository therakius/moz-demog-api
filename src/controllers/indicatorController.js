import db from "../models/db.js";

async function sendResponse(res, query, params = []) {
    try {
        const result = await db.query(query, params);

        if (!result.rows.length) {
            return res.status(404).json({ error: "Informacao nao encontrada" });
        }

        const row = result.rows[0];

        const dataArray = [
            row?.info?.indicators,
            row?.dependency_rate,
            row?.life_expectancy,
            row?.infant_mortality
        ].find(data => data !== undefined && data !== null);

        res.json(dataArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export async function getPopIndicators(req, res) {

    const query = `
        select json_build_object(
        'indicators', json_agg(
            json_build_object(
            'year', y.year,
            'indicators_for_year', json_build_object(
                'populational_indicators', row_to_json(cpi),
                'dependency_rate', row_to_json(dr),
                'life_expectancy', row_to_json(leb),
                'infant_mortality', row_to_json(im)
            )
            )
        )
        ) info
        from year y
        left join country_pop_indicators cpi on y.id = cpi.year_id
        left join dependency_rate dr on y.id = dr.year_id
        left join life_expectancy_at_birth leb on y.id = leb.year_id
        left join infant_mortality im on y.id = im.year_id
    `;

    sendResponse(res, query);
    
}

export async function getPopIndicatorsPerYear(req, res) {

    const year = req.params.year;

    const query = `
        select json_build_object(
        'indicators', json_agg(
            json_build_object(
            'year', y.year,
            'indicators_for_year', json_build_object(
                'populational_indicators', row_to_json(cpi),
                'dependency_rate', row_to_json(dr),
                'life_expectancy', row_to_json(leb),
                'infant_mortality', row_to_json(im)
            )
            )
        )
        ) info
        from year y
        left join country_pop_indicators cpi on y.id = cpi.year_id
        left join dependency_rate dr on y.id = dr.year_id
        left join life_expectancy_at_birth leb on y.id = leb.year_id
        left join infant_mortality im on y.id = im.year_id
        where year = $1
    `;

    if (year > 2026 || year < 2017) {
        return res.status(404).json({info: 'Data unavailable'})
    }
    
    sendResponse(res, query, [year]);
    
}

export async function dependencyRate(req, res){
    const query = `
        select json_agg(
            json_build_object(
                'year', y.year,
                'indicators', row_to_json(dr)
            )
        ) dependency_rate
        from year y
        join dependency_rate dr on y.id = dr.year_id;
    `

    sendResponse(res, query);
}

export async function dependencyRatePerYear(req, res) {
    const year = req.params.year
    const query = `
        select json_agg(
            json_build_object(
                'year', y.year,
                'indicators', row_to_json(dr)
            )
        ) dependency_rate
        from year y
        join dependency_rate dr on y.id = dr.year_id
        where year = $1;
    `
    ;

    if (year > 2026 || year < 2017) {
        return res.status(404).json({info: 'Data unavailable'});
    }

    sendResponse(res, query, [year]);
}

export async function lifeExpectancy(req, res){
    const query = `
        select json_agg(
            json_build_object(
                'year', y.year,
                'life-expectancy', row_to_json(leb)
            )
        ) life_expectancy
        from year y
        join life_expectancy_at_birth leb on y.id = leb.year_id;
    `

    sendResponse(res, query);
}

export async function lifeExpectancyPerYear(req, res) {

    const year = req.params.year
    const query = `
        select json_agg(
            json_build_object(
                'year', y.year,
                'life-expectancy', row_to_json(leb)
            )
        ) life_expectancy
        from year y
        join life_expectancy_at_birth leb on y.id = leb.year_id
        where y.year = $1
    `

    if (year > 2026 || year < 2017) {
        return res.status(404).json({info: 'Data unavailable'})
    }

    sendResponse(res, query, [year]);
}

export async function infantMortality(req, res){
    const query = `
        select json_agg(
            json_build_object(
                'year', y.year,
                'infant_mortality', row_to_json(im)
            )
        ) infant_mortality
        from year y
        join infant_mortality im on y.id = im.year_id;
    `

    sendResponse(res, query);
}

export async function infantMortalityPerYear(req, res){

    const year = req.params.year

    const query = `
        select json_agg(
            json_build_object(
                'year', y.year,
                'infant_mortality', row_to_json(im)
            )
        ) infant_mortality
        from year y
        join infant_mortality im on y.id = im.year_id
        where y.year = $1;
    `

    if (year > 2026 || year < 2017) {
        return res.status(404).json({info: 'Data unavailable'})
    }


    sendResponse(res, query, [year]);
}