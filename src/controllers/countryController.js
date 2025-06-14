import db from "../models/db.js";

export async function getCountryData (req, res) {
    const query = `
            select json_build_object(
                'country_information_year', (
                    select json_build_object(
                        'year', y.year,
                        'president', y.head_of_state,
                        'capital_city', cd.capital_city,
                        'official_language', cd.official_language,
                        'independence_date', cd.independence_date,
                        'total_area_sqkm', cd.total_area_sqkm

                    ) from year y, country_data cd
                ),
                'provinces_data', (
                    select json_agg(row_to_json(pd))
                    from (
                    select * from provinces
                    ) pd
                ),
                'populational_data', (
                    select json_build_object(
                        'dependency_rate', (
                            select json_agg(row_to_json(dr))
                            from (select y.year, dpr.total, dpr.young 
                            from dependency_rate dpr, year y 
                            where y.id = dpr.year_id) dr
                            ),
                        'population_per_thousand', (
                            SELECT json_agg(row_to_json(ppt))
                            FROM (
                                SELECT y.year, p.province_name, pt.per_thousand_male, pt.per_thousand_female, pt.per_thousand_total 
                                FROM population_per_thousand pt, year y, provinces p 
                                WHERE y.id = p.year_id AND p.id = pt.province_id
                            ) ppt
                        ),
                        'population_percentual_structure', (
                            select json_agg(row_to_json(ps))
                            from (
                                SELECT y.year, p.province_name, pst.male_population, pst.female_population, pst.total 
                                FROM population_percentual_structure pst , year y, provinces p 
                                WHERE y.id = p.year_id AND p.id = pst.province_id
                            ) ps
                        ),
                        'life_expectancy_at_birth', (
                            select json_agg(row_to_json(leb))
                            from (select y.year, leb.average_life_expectancy, leb.male_life_expectancy, leb.female_life_expectancy 
                            from year y, life_expectancy_at_birth leb
                            where leb.year_id = y.id
                            ) leb
                        ),
                        'infant_mortality', (
                            select json_agg(row_to_json(infm))
                            from (
                                select y.year, im.average_infant_mortality, im.male_infant_mortality, im.female_infant_mortality
                                from year y, infant_mortality im
                                where y.id = im.year_id
                            ) infm
                        ),
                        'general_indicators', (
                            select json_agg(row_to_json(gnr))
                            from (
                                select y.year, cpi.*
                                from year y, country_pop_indicators cpi
                                where y.id = cpi.year_id
                            ) gnr
                        )
                        
                        
                        ) 
                    )
                ) as general_information;

    `
    try {
       const result = await db.query(query)

        if (result.rows.lenght === 0) {
            return res.status(404).json({erro: "Informacao nao encontrada"})
        }

        const data = result.rows[0];
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Erro ao buscar dados do pais"});
    }
}