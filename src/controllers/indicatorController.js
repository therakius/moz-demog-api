import db from "../models/db.js";

export async function getPopIndicators(req, res) {

    const query = `
        SELECT y.year, cpi.*
        FROM year y, country_pop_indicators cpi
        ORDER BY y.year;
    `
    try {
        const result = await db.query(query)

        if(result.rowCount === 0){
            return res.status(404).json({info: 'Data not found'})
        }

        res.status(200).json({data : result.rows})

    } catch (error) {
        console.log(error)
        res.status(500).json({info: 'internal server error'})
    }
    
}

export async function getPopIndicatorsPerYear(req, res) {

    const year = req.params.year;

    const query = `
        SELECT y.year, cpi.*
        FROM year y, country_pop_indicators cpi
        where y.year = $1
        ORDER BY y.year;
    `
    try {
        const result = await db.query(query, [year])

        if(result.rowCount === 0){
            return res.status(404).json({info: 'Data not found'})
        }

        res.status(200).json({data : result.rows})
    } catch (error) {
        res.status(500).json({info: 'internal server error'})
    }
    
}

export async function dependencyRate(req, res){
    const query = `
        select y.year, dr.*
        from year y, dependency_rate dr
    `

    try {
        const result = await db.query(
            query
        )

        if (result.rowCount === 0){
            return res.status(404).json({info: 'Data not found'})
        }

        res.json({data: result.rows})

    } catch (error) {
        console.error(error, error.message)
        res.status(500).json({info: 'internal server error'})
    }
}

export async function dependencyRatePerYear(req, res) {
    const year = req.params.year
    const query = `
        select y.year, dr.*
        from year y, dependency_rate dr
        where y.year = $1
    `

    try {
        const result = await db.query(query, [year])
        
        if(result.rowCount === 0) {
            return res.status(404).json({info: 'Data not found'})
        }

        res.status(200).json({data: result.rows})
    } catch (error) {
        console.log(error)
        res.status(500).json({info : 'internal server error'})
    }
    
}

export async function lifeExpectancy(req, res){
    const query = `
        select y.year, leb.*
        from year y, life_expectancy_at_birth leb
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