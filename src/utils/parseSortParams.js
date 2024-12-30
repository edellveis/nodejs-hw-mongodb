const sortOrderList = ['asc', 'desc'];

export const parseSortParams = ({ sortBy, sortOrder }, sortByList) => {
  const parsedSortOrder = sortOrderList.includes(sortOrder)
    ? sortOrder
    : sortOrderList[0];

  const parsedSortby = sortByList.includes(sortBy) ? sortBy : 'name';

  return {
    sortBy: parsedSortby,
    sortOrder: parsedSortOrder,
  };
};
