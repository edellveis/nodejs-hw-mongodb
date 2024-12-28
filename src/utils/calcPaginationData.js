export const calcPaginationData = ({ totalitems, page, perPage }) => {
  const totalPages = Math.ceil(totalitems / perPage);
  const hasNexPage = page < totalPages;
  const hasPreviusPage = page > 1;

  return {
    page,
    perPage,
    totalitems,
    totalPages,
    hasPreviusPage,
    hasNexPage,
  };
};
