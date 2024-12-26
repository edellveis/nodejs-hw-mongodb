const sortOrderList = ['asc', 'desc'];

export const parseSortParams = ({ sortBy, sortOrder }, sortByList) => {
  const parsedSortOrder = sortOrderList.includes(sortOrder)
    ? sortOrder
    : sortOrderList[0];

  const parsedSortby = sortByList.includes(sortBy) ? sortBy : '_id';

  return {
    parsedSortOrder,
    parsedSortby,
  };
};
