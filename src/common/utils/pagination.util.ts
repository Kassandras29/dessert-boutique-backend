export function buildPaginationLink(
  path: string,
  page: number,
  limit: number,
  total: number,
) {
  const links: string[] = [];

  const totalPages = Math.ceil(total / limit);

  if (page > 1) {
    links.push(`<${path}?page=${page - 1}&limit=${limit}>; rel="prev"`);
  }

  if (page < totalPages) {
    links.push(`<${path}?page=${page + 1}&limit=${limit}>; rel="next"`);
  }

  return links.join(', ');
}
