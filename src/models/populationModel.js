export function getPopulationQuery(requestQuery, per_page, offset) {
  const { year, p_name, field } = requestQuery;

  let selectedField = null;

  if (field) {
    selectedField = field;
  }

  let selectFields = `
            'year', y.year,
            'province_name', p.province_name, 'population_density', p.population_density,
            'population_per_thousand',
                JSON_BUILD_OBJECT(
                    'total', ppt.per_thousand_total,
                    'male', ppt.per_thousand_male,
                    'female', ppt.per_thousand_female
                ),
            'percentual_structure',
                JSON_BUILD_OBJECT(
                    'percentual_total', pps.total,
                    'percentual_male', pps.male_population,
                    'percentual_female', pps.female_population
                )
        `;

  if (selectedField === "p_thousand") {
    selectFields = `
                'year', y.year,
                'province_name', p.province_name, 'population_density', p.population_density,
                'population_per_thousand',
                    JSON_BUILD_OBJECT(
                        'total', ppt.per_thousand_total,
                        'male', ppt.per_thousand_male,
                        'female', ppt.per_thousand_female
                    )
            `;
  } else if (selectedField === "p_structure") {
    selectFields = `
                'year', y.year,
                'province_name', p.province_name, 'population_density', p.population_density,
                'percentual_structure',
                    JSON_BUILD_OBJECT(
                        'percentual_total', pps.total,
                        'percentual_male', pps.male_population,
                        'percentual_female', pps.female_population
                    )
            `;
  }

  let query = `
            SELECT JSON_BUILD_OBJECT(${selectFields}) AS data
            FROM public.year y
            INNER JOIN provinces p ON p.year_id = y.id
            INNER JOIN population_per_thousand ppt ON ppt.province_id = p.id
            INNER JOIN population_percentual_structure pps ON pps.province_id = p.id
            WHERE 1 = 1
        `;

  let params = [];
  let idx = 1;

  if (year) {
    query += ` AND y.year = $${idx}`;
    params.push(year);
    idx++;
  }

  if (p_name) {
    query += ` AND LOWER(p.province_name) = LOWER($${idx})`;
    params.push(p_name);
    idx++;
  }

  params.push(per_page, offset)
  query += ` ORDER BY Y.YEAR ASC LIMIT $${params.length - 1} OFFSET $${
  params.length
  }`;


  return { query: query, params: params };
}


export function makePopulationCountQuery(req) {
  const { year, p_name } = req.query;

  let pQueryC = `SELECT
    count(*)::int AS total
    FROM
      PUBLIC.YEAR Y
      INNER JOIN PROVINCES P ON P.YEAR_ID = Y.ID
      INNER JOIN POPULATION_PER_THOUSAND PPT ON PPT.PROVINCE_ID = P.ID
      INNER JOIN POPULATION_PERCENTUAL_STRUCTURE PPS ON PPS.PROVINCE_ID = P.ID
    WHERE
      1=1
  `;

  const pParamsC = [];
  let paramIndex = 1;

  if (year) {
    pQueryC += ` AND y.year = $${paramIndex}`;
    pParamsC.push(year);
    paramIndex++;
  }

  if (p_name) {
    pQueryC += ` AND lower(province_name) = $${paramIndex}`;
    pParamsC.push(p_name);
    paramIndex++;
  }

  console.log(pParamsC)
  return { pQueryC, pParamsC };
}
