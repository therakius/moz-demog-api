import db from "../models/db.js";

export async function getAllCountryData (req, res) {
    const query = `
select json_build_object(
    'country_info', (select json_build_object(
		 'list_of_provinces', (
            select json_agg(p.province_name)
            from provinces p
            ),
			'capital_city', (select capital_city from country_data),
			'independence_data', (select independence_date from country_data),
			'official_language', (select official_language from country_data),
			'president_per_year', (SELECT json_agg(
      json_build_object(
        'year', y.year,
		'president', y.head_of_state
        )
      ) from year y)
    )),

  'indicators', (
    SELECT json_agg(
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
    FROM year y
    LEFT JOIN country_pop_indicators cpi ON y.id = cpi.year_id
    LEFT JOIN dependency_rate dr ON y.id = dr.year_id
    LEFT JOIN life_expectancy_at_birth leb ON y.id = leb.year_id
    LEFT JOIN infant_mortality im ON y.id = im.year_id
    ),

    'provinces_data', (
        select json_agg(
            json_build_object(
                'province_name', p.province_name,
                'province_info', row_to_json(p)
            )
        )
        from provinces p
    ),

    'population_per_province', (
        select json_agg(
        json_build_object(
            'province_name', p.province_name,
            'population_per_1000hab', row_to_json(ppt),
            'population_percentual_structure', row_to_json(pps)
        )            
        )
        from provinces p 
        left join population_percentual_structure pps on p.id = pps.province_id
        left join population_per_thousand ppt on p.id = ppt.province_id

        
    )
) info;
    `
    try {
       const result = await db.query(query)

        if (result.rows.lenght === 0) {
            return res.status(404).json({erro: "Informacao nao encontrada"})
        }

        const dataArray = [];

        dataArray.push(result.rows[0].info)
        res.json(dataArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal error."});
    }
}

export async function getCountryData(req, res){
    const date = new Date()
    const currentYear = date.getFullYear()
    const query = `

    select json_build_object(
        'year', y.year,
        'head_of_state', y.head_of_state,
        'list_of_provinces', (select json_agg(p.province_name)
    from provinces p),
        'total_area_km2', cd.total_area_sqkm,
        'independence_date', cd.independence_date
    )info from country_data cd, year y
    where y.year = ${currentYear}
    
    `

    try {
        const result = await db.query(query)

        if (result.rows.length === 0) {
            return res.status(404).json({erro: "Data not found"})
        }

        const dataArray = [];

        dataArray.push(result.rows[0].info)
        res.json(dataArray);
    } catch (error) {
        res.status(500).json({erro: "Internal server error"})
    }
}

export async function getCountryDataPerYear(req, res) {

    const year = req.params.year;

    const query = `
 select json_build_object(
    'country_info', (select json_build_object(
        'country_data', (
            select json_agg(row_to_json(t))
            from (
                select y.year, y.head_of_state
				from year y
                where y.year = $1
            ) t
            )
    )),

  'indicators', (
    SELECT json_agg(
      json_build_object(
        'indicators_for_year', json_build_object(
          'populational_indicators', row_to_json(cpi),
          'dependency_rate', row_to_json(dr),
          'life_expectancy', row_to_json(leb),
          'infant_mortality', row_to_json(im)
        )
      )
    )
    FROM year y
    LEFT JOIN country_pop_indicators cpi ON y.id = cpi.year_id
    LEFT JOIN dependency_rate dr ON y.id = dr.year_id
    LEFT JOIN life_expectancy_at_birth leb ON y.id = leb.year_id
    LEFT JOIN infant_mortality im ON y.id = im.year_id
    where y.year = $1
    ),

    'provinces_data', (
        select json_agg(
            json_build_object(
                'province_name', p.province_name,
                'province_info', row_to_json(p)
            )
        )
        from provinces p, year y
		where p.year_id = y.id
        and y.year = $1
    ),

    'population_per_province', (
        select json_agg(
        json_build_object(
            'province_name', p.province_name,
            'population_per_1000hab', row_to_json(ppt),
            'population_percentual_structure', row_to_json(pps)
        )            
        )
        from provinces p 
        left join population_percentual_structure pps on p.id = pps.province_id
        left join population_per_thousand ppt on p.id = ppt.province_id
        left join year y on y.id = p.year_id
        where y.year = $1
    )

) info;

    `

    try {
        const result = await db.query(query, [year])

        if (result.rowCount === 0){
            return res.status(404).json({info: "Data not found"})
        }

        const dataArray =[]
        dataArray.push(result.rows[0].info)
        res.json(dataArray);

    } catch (error) {
        console.log(error)
        res.status(500).json({erro: "Internal server error"})
    }
    
}