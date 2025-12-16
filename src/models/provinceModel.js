export function getProvinceQuery(requestQuery) {
  let p_name = requestQuery.p_name;

  let whereClause = "";

  let params = [];

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

    whereClause += ` and lower(p.province_name) = $1`;
    params.push(p_name);
    query += whereClause;
  }
  return { query: query, params: params };
}

export function getProvinceListQuery(){

    const query = `select json_build_object('provinces', json_agg(province_name) ) data from provinces`;

    return query
}

export function getProvincesForValidate(province){
  const params = [province]
  const query = "select province_name from provinces where lower(province_name) = $1"

  return {"query": query, "params": params}
}
