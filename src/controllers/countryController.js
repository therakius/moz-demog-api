import db from "../models/db.js";

export async function getCountryData (req, res) {
    try {
       const result = await db.query("select year.name, head_of_state, capital_city, official_language, TO_CHAR(independence_date, 'YYYY-MM-DD') AS independence_date , area_in_sqkm from year, country_data;")

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