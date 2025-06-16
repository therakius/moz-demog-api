import db from "../models/db.js";

export async function getProvinces(req, res) {
    try {
        const result = await db.query('select * from provinces');
        res.json(result.rows)
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Erro ao buscar provincias"});
    }
}

export async function getProvincesByName (req, res) {
    const name = req.params.name
    console.log(name)
    try {
        const result = await db.query("select * from provinces where province_name = $1", 
        [name]
    );

        if (result.rows.length === 0) return res.status(404).json({erro: "province not found"});

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }
}

export async function percentualStructureByProvinceName(req, res) {
    const name = req.params.name
    const query = `
        select p.province_name, pps.male_population, pps.female_population, total as average
        from provinces p, population_percentual_structure pps
        where p.id = pps.province_id
        and p.province_name = $1;
    `

    try {
        const result = await db.query(query, [name])
        
        if (result.rows.length === 0) return res.status(404).json({erro: "province not found"});

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }

    
}

export async function perThousandByProvinceName(req, res) {
    const name = req.params.name
    const query = `
        select p.province_name, ppt.per_thousand_male, ppt.per_thousand_female, ppt.per_thousand_total as total
        from provinces p, population_per_thousand ppt
        where p.id = ppt.province_id
        and p.province_name = $1
        ;
    `

    try {
        const result = await db.query(query, [name])
        
        if (result.rows.length === 0) return res.status(404).json({erro: "province not found"});

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }

    
}

export async function getProvincesbyYear(req, res){
    const year = req.params.year;

    const query = `
        select y.year, p.*
        from year y, provinces p
        where y.year = $1
        and y.id = p.year_id;
    `


    try {
        const result = await db.query(query, [year])
        console.log(result)
        if (result.rows.length === 0) return res.status(404).json({erro: "province not found"});

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }

}

export async function getAvailableYears(req, res) {

    const query = `

        select y.year from year y;
    
    `
    try {
        const result = await db.query(query)
        console.log(result)
        if (result.rowsCount === 0) return res.status(404).json({erro: "province not found"});

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }   
}