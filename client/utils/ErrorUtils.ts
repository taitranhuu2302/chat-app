export const getErrorResponse = (errors: string | string[]) => {
  if (typeof errors === 'string') {
    return [errors];
  }
  return [...errors];
};