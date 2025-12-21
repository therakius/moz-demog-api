export function getProvinceQuery(requestQuery, per_page, offset) {
  let p_name = requestQuery.p_name;
  let whereClause = "";

  let params = [];

  let paramIndex = 1

  let query = `
        select json_build_object(
        'year', y.year,
        'province_name', p.province_name,
        'population_density', p.population_density,
        'area_in_sqkm', p.area_in_sqkm,
        'data_state', y.data_state
        ) as data
        from provinces p
        inner join year y on y.id = p.year_id
        where 1 = 1   
    `;

  if (p_name) {
    p_name = p_name.toLowerCase();

    whereClause += ` and lower(p.province_name) = $${paramIndex}`;
    params.push(p_name);
    query += whereClause;
    paramIndex++;
  }

  params.push(per_page, offset)
  query+=` order by p.id desc limit $${params.length -1} offset $${params.length}`;

  return { query: query, params: params };
}


export function getProvinceCountQuery(req){
  const p_name = req.query.p_name;

  let pQueryCount = `
    SELECT
      count(*)::int as total
    FROM
      PROVINCES P
      INNER JOIN YEAR Y ON Y.ID = P.YEAR_ID
    WHERE
	1 = 1
  `

  let pQueryParams = [];
  let paramIndex = 1;

  if(p_name != null) {
    pQueryCount +=` and lower(province_name) = $${paramIndex}`
    pQueryParams.push(p_name)
    paramIndex++
  }


  return {pQueryCount, pQueryParams}
}



export function getProvinceListQuery(){

    const query = `select json_build_object('provinces', json_agg(province_name) ) data from provinces`;

    return query
}

export function getProvincesForValidate(province){
  province = province.toLowerCase()
  const params = [province]
  const query = "select province_name from provinces where lower(province_name) = $1"

  return {"query": query, "params": params}
}
