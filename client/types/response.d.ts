type ResponseSuccess<T> = {
  data: T;
  isSuccess: boolean;
  statusCode: number;
};

type Paginate<T> = {
  results: T[],
  meta: { 
    total: number, limit: number, page: number, lastPage: number, prevPage: number, nextPage: number
  }
}