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

        if (result.rows.length === 0) return res.status(404).json({erro: "provincia nao encontrada"});

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Erro ao buscar provincias"});
    }
}