import { clone } from 'lodash';
import { Query } from 'mongoose';

export interface PaginationOptions {
  limit?: number;
  page?: number;
  search?: Record<string, any>;
  sort?: string;
}

/**
 * Paginate a mongoose query result
 * @param query The query you want to paginate
 * @param options Pagination options like page number and/or items per page
 * @param formatResults
 * @returns Paginated query with metadata
 */
export const paginate = async <T, TResult>(
  query: Query<any, T>,
  options?: PaginationOptions,
  formatResults?: (data: T[]) => Promise<TResult[]>,
) => {
  const { limit = 10, page = 1, search, sort } = options;
  let _query = clone(query);

  if (search) {
    for (const key in search) {
      if (Object.prototype.hasOwnProperty.call(search, key)) {
        _query = _query.where(key, search[key]);
      }
    }
  }

  if (sort) {
    const sortOrder = sort.startsWith('-') ? -1 : 1;
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
    _query = _query.sort({ [sortField]: sortOrder });
  }

  const total = await _query.count().exec();
  const lastPage = Math.ceil(total / limit);
  const data = await query
    .limit(limit)
    .skip(limit * (page - 1))
    .exec();
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < lastPage ? page + 1 : null;

  if (formatResults) {
    const formattedData = await formatResults(data);
    return {
      results: formattedData,
      meta: { total, limit, page, lastPage, prevPage, nextPage },
    };
  }

  return {
    results: data,
    meta: { total, limit, page, lastPage, prevPage, nextPage },
  };
};
