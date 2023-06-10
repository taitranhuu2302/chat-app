import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationOptions } from '../helper/pagination.helper';

export const PaginateQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationOptions => {
    const request = ctx.switchToHttp().getRequest();
    const { page, limit, ...search } = request.query;

    return {
      page: parseInt(page, 10) || undefined,
      limit: parseInt(limit, 10) || undefined,
      search,
    };
  },
);