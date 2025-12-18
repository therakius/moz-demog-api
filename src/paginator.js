export function paginateResults(page, per_page, totalCount) {
  const totalPages = Math.ceil(totalCount / per_page);

  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    current_page: page,
    records_per_page: per_page,
    total_records: totalCount,
    total_pages: totalPages,
    has_next: hasNext,
    has_prev: hasPrev,
  };
}
