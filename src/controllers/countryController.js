import db from "../models/db.js";

export async function getCountryData (req, res) {
    const query = `
        SELECT
        y.year,
        y.head_of_state,

        (
            SELECT row_to_json(cd)
            FROM country_data cd
        ) AS country_data,


        (
            SELECT row_to_json(cpi)
            FROM country_pop_indicators cpi
            WHERE cpi.year_id = y.id
        ) AS indicators,

        (
            SELECT row_to_json(dr)
            FROM dependency_rate dr
            WHERE dr.year_id = y.id
        ) AS dependency_rate,

        (
            SELECT row_to_json(le)
            FROM life_expectancy_at_birth le
            WHERE le.year_id = y.id
        ) AS life_expectancy,

        (
            SELECT row_to_json(im)
            FROM infant_mortality im
            WHERE im.year_id = y.id
        ) AS infant_mortality

        FROM year y;

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