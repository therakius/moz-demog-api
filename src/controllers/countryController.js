import db from "../models/db.js";

export async function sendResponse(res, query, params = []) {
    try {
        const result = await db.query(query, params);
        const rows = result.rows

        if (!rows.length) {
            return res.status(404).json({ error: "Informacao nao encontrada" });
        }

        res.status(200).json({
            'success': true,
            'status': 200,
            'message': 'General country informations found successfully',
            'errors': [],
            'data': rows[0]?.data
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export async function getCountry(req, res){
    const date = new Date();
    const currentYear = date.getFullYear();
    const year = req.query.year || currentYear;
    
    const query = `
        SELECT
            JSON_BUILD_OBJECT(
                    'country_name',
                    'mozambique',
                    'current_president', (select Y.HEAD_OF_STATE from public.year y where y.year = ${year}),
                    'area',
                    CD.TOTAL_AREA_SQKM,
                    'capital_city',
                    CD.CAPITAL_CITY,
                    'independence_date',
                    CD.INDEPENDENCE_DATE,
                    'official_language',
                    CD.OFFICIAL_LANGUAGE
            ) as data
        FROM
            COUNTRY_DATA AS CD
    `;

    sendResponse(res, query);
}