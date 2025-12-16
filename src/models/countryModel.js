
export function makeCountryQuery(year){
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

    return query
}