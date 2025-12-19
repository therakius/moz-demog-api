export function makeIndicatorsQuery(requestQuery, per_page, offset) {
  let { y_start, y_end, fields } = requestQuery;

  let query = `
        SELECT 
            JSON_BUILD_OBJECT(

                -- bloco principal
                'year', Y.YEAR,
                'total_population', CPI.TOTAL_POPULATION,
                'male', CPI.MALE_POPULATION,
                'female', CPI.FEMALE_POPULATION,
                'urban_percent', CPI.URBAN_PERCENTUAL,
                'sex_raio', CPI.SEX_RATIO,
                'median_age', CPI.MEDIAN_AGE,
                'gross_birth_rate', CPI.GROSS_BIRTH_RATE,
                'gross_mortality_rate', CPI.GROSS_MORTALITY_RATE,
                'growth_rate', CPI.GROWTH_RATE,

                -- dependency_rate
                'dependency_rate',
                    JSON_BUILD_OBJECT(
                        'total', DR.TOTAL,
                        'young', DR.YOUNG
                    ),

                -- life_expectancy_at_birth
                'life_expectancy_at_birth',
                    JSON_BUILD_OBJECT(
                        'average', LEB.AVERAGE_LIFE_EXPECTANCY,
                        'male', LEB.MALE_LIFE_EXPECTANCY,
                        'female', LEB.FEMALE_LIFE_EXPECTANCY
                    ),

                -- infant_mortality
                'infant_mortality',
                    JSON_BUILD_OBJECT(
                        'average', IM.AVERAGE_infant_mortality,
                        'male', IM.MALE_infant_mortality,
                        'female', IM.FEMALE_infant_mortality
                    )
        `;

  let extras = [];

  let fromWhere = `as data
        FROM
                PUBLIC.YEAR Y
            INNER JOIN COUNTRY_POP_INDICATORS CPI ON CPI.YEAR_ID = Y.ID
            INNER JOIN DEPENDENCY_RATE DR ON DR.YEAR_ID = Y.ID
            INNER JOIN LIFE_EXPECTANCY_AT_BIRTH LEB ON LEB.YEAR_ID = Y.ID
            INNER JOIN INFANT_MORTALITY IM ON IM.YEAR_ID = Y.ID
            WHERE 1 = 1
    `;

  let params = [];

  // manter lógica de fields extras
  if (fields) {
    fields = JSON.parse(fields);
    fields.forEach((field) => {
      query = `SELECT 
                    JSON_BUILD_OBJECT(
                    'year', Y.YEAR,
                `;

      if (field === "p_thousand") {
        extras.push(
          `'total_population', CPI.TOTAL_POPULATION,'male', CPI.MALE_POPULATION,'female', CPI.FEMALE_POPULATION,'urban_percent', CPI.URBAN_PERCENTUAL,'sex_raio', CPI.SEX_RATIO,'median_age', CPI.MEDIAN_AGE,'gross_birth_rate', CPI.GROSS_BIRTH_RATE,'gross_mortality_rate', CPI.GROSS_MORTALITY_RATE,'growth_rate', CPI.GROWTH_RATE`
        );
      }
      if (field === "d_rate") {
        extras.push(
          `'dependency_rate', JSON_BUILD_OBJECT('total', DR.TOTAL, 'young', DR.YOUNG)`
        );
      }

      if (field == "l_expectancy") {
        extras.push(
          `'life_expectancy',JSON_BUILD_OBJECT('average', LEB.AVERAGE_LIFE_EXPECTANCY,'male', LEB.MALE_LIFE_EXPECTANCY,'female', LEB.FEMALE_LIFE_EXPECTANCY)`
        );
      }

      if (field === "i_mortality") {
        extras.push(
          `'infant_mortality', JSON_BUILD_OBJECT('average', IM.AVERAGE_infant_mortality,'male', IM.MALE_infant_mortality,'female', IM.FEMALE_infant_mortality)`
        );
      }
    });
  }

  // filtros de anos
  if (y_start && y_end) {
    fromWhere += ` and y.year between $${params.length + 1} and $${
      params.length + 2
    }`;
    params.push(y_start, y_end);
  }

  if (y_start && !y_end) {
    fromWhere += ` and y.year = $${params.length + 1}`;
    params.push(y_start);
  }

  // juntar extras
  if (extras.length > 0) {
    extras = extras.join(", ");
    extras += ")";
    query += extras;
  } else {
    query += ")"; // fecha JSON_BUILD_OBJECT principal
  }

  // juntar fromWhere
  query += fromWhere;

  // adicionar paginação
  params.push(per_page, offset);
  query += ` ORDER BY Y.YEAR ASC LIMIT $${params.length - 1} OFFSET $${
    params.length
  }`;

  return { query, params };
}

export function makeIndicatorsCountQuery(req) {
  const { y_start, y_end } = req.query;

  let iQueryC = `
      SELECT COUNT(*)::int AS total
      FROM PUBLIC.YEAR Y
      INNER JOIN COUNTRY_POP_INDICATORS CPI ON CPI.YEAR_ID = Y.ID
      WHERE 1 = 1
  `;

  let iParamsC = [];

  if (y_start && y_end) {
    iQueryC += ` AND y.year BETWEEN $1 AND $2`;
    iParamsC.push(y_start, y_end);
  }

  if (y_start && !y_end) {
    iQueryC += ` AND y.year = $1`;
    iParamsC.push(y_start);
  }

  return { iQueryC, iParamsC };
}
