import db from "../models/db.js";

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
    `
    try {
        const result = await db.query(query)

        if(result.rowCount === 0){
            return res.status(404).json({info: 'Data not found'})
        }

        res.status(200).json(result.rows)

    } catch (error) {
        console.log(error)
        res.status(500).json({info: 'internal server error'})
    }
    
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
    `

    if (year > 2026 || year < 2017) {
        return res.status(404).json({info: 'Data unavailable'})
    }
    
    try {
        const result = await db.query(query, [year])

        if(result.rowCount === 0){
            return res.status(404).json({info: 'Data not found'})
        }

        res.status(200).json(result.rows)
    } catch (error) {
        res.status(500).json({info: 'internal server error'})
    }
    
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

    try {
        const result = await db.query(
            query
        )

        if (result.rowCount === 0){
            return res.status(404).json({info: 'Data not found'})
        }

        res.status(200).json(result.rows)

    } catch (error) {
        console.error(error, error.message)
        res.status(500).json({info: 'internal server error'})
    }
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


    if (year > 2026 || year < 2017) {
        return res.status(404).json({info: 'Data unavailable'})
    }

    try {
        const result = await db.query(query, [year])
        
        if(result.rowCount === 0) {
            return res.status(404).json({info: 'Data not found'})
        }

        res.status(200).json(result.rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({info : 'internal server error'})
    }
    
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

    try {
        const result = await db.query(query)

        if(result.rowCount === 0) {
            return res.status(404).json({info: 'Data not found'})
        }

        res.status(200).json(result.rows)
    } catch (error) {
        console.log(error)
        res.status(500).json({info: 'internal server error'})
    }
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

    try {
        const result = await db.query(query, [year])

        if(result.rowCount === 0) {
            return res.status(404).json({info: 'Data not found'})
        }

        res.status(200).json(result.rows)

    } catch (error) {
        console.log(error)
        res.status(500).json({info: 'internal server error'})
    }
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

    try {

        const result = await db.query(query)

        if(result.rowCount === 0) {
            return res.status(404).json({info: 'Data not found'})
        }

        res.status(200).json({data: result.rows})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({info: 'internal server error'})
    }
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


    try {

        const result = await db.query(query, [year])

        if(result.rowCount === 0) {
            return res.status(404).json({info: 'Data not found'})
        }

        res.status(200).json({data: result.rows})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({info: 'internal server error'})
    }
}