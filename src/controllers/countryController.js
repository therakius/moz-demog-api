import db from "../models/db.js";

export async function getCountryData (req, res) {
    try {
        result = await db.query("select year.name, head_of_state, capital_city, official_language, independence_date, area_in_sqkm from year, country_data;")

        if (result.rows.lenght === 0) {
            return res.status(404).json({erro: "Informacao nao encontrada"})
        }

        res.json(result.rows[0])
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Erro ao buscar dados do pais"});
    }
}