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