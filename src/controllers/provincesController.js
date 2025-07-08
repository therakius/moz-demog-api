import db from "../models/db.js";

export async function getProvinces(req, res) {

    const query = `
    
        select json_agg(
        json_build_object(
            'province_name', p.province_name,
            'population_per_1000hab', row_to_json(ppt),
            'population_percentual_structure', row_to_json(pps)
            )            
        ) province_data
        from provinces p 
        left join population_percentual_structure pps on p.id = pps.province_id
        left join population_per_thousand ppt on p.id = ppt.province_id
    
    `
    try {
        const result = await db.query(query);
        res.status(200).json(result.rows[0].province_data)
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }
}

export async function getProvincesByName (req, res) {
    const name = req.params.name

    const query = `
    
        select json_agg(
        json_build_object(
            'province_name', p.province_name,
            'population_per_1000hab', row_to_json(ppt),
            'population_percentual_structure', row_to_json(pps)
            )            
        ) province_data
        from provinces p 
        left join population_percentual_structure pps on p.id = pps.province_id
        left join population_per_thousand ppt on p.id = ppt.province_id
        where province_name = $1
    
    `
    try {
        const result = await db.query(query,[name]);

        if (result.rowCount === 0) return res.status(404).json({erro: "province not found"});

        res.status(200).json(result.rows[0].province_data)
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }
}

export async function percentualStructureByProvinceName(req, res) {
    const name = req.params.name
    const query = `
        select json_agg(
        json_build_object(
            'province_name', p.province_name,
            'population_percentual_structure', row_to_json(pps)
            )            
        ) province_data
        from provinces p 
        left join population_percentual_structure pps on p.id = pps.province_id
        where p.province_name = $1;
    `

    try {
        const result = await db.query(query, [name])
        
        if (result.rowsCount === 0) return res.status(404).json({erro: "province not found"});

      res.status(200).json(result.rows[0].province_data)

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }

    
}

export async function perThousandByProvinceName(req, res) {
    const name = req.params.name
    const query = `
        select json_agg(
        json_build_object(
            'province_name', p.province_name,
            'population_per_1000hab', row_to_json(ppt)
            )            
        ) province_data
        from provinces p 
        left join population_per_thousand ppt on p.id = ppt.province_id
        where p.province_name = $1
        ;
    `

    try {
        const result = await db.query(query, [name])
        
        if (result.rowCount === 0) return res.status(404).json({erro: "province not found"});

      res.status(200).json(result.rows[0].province_data)

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }

    
}

export async function getProvincesbyYear(req, res){
    const year = req.params.year;
    

    const query = `
    
      select json_agg(
        json_build_object(
			'year', y.year,
            'province_name', p.province_name,
            'population_per_1000hab', row_to_json(ppt),
            'population_percentual_structure', row_to_json(pps)
            )            
        ) province_data
        from provinces p 
        left join population_percentual_structure pps on p.id = pps.province_id
        left join population_per_thousand ppt on p.id = ppt.province_id
        left join year y on y.id = p.year_id
        where y.year = $1
    `
    

        if (Number(year) !== 2023) {
        return res.status(404).json({info: 'Only data from 2023 is available for provinces'})
    }
    try {
        const result = await db.query(query, [year])
        
        if (result.rowCount === 0) return res.status(404).json({erro: "province not found"});

      res.status(200).json(result.rows[0].province_data)

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }

}

export async function getAvailableYears(req, res) {

    const query = `

        select y.year
        from year y
        left join provinces p on y.id = p.year_id
        where p.province_name is not null
		group by y.year
    
    `
    try {
        const result = await db.query(query)
        
        if (result.rowsCount === 0) return res.status(404).json({erro: "province not found"});

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal server error"});
    }   
}