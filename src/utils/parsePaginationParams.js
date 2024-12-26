const parseNumber = (number, defaultvalue) => {
  if (typeof number !== 'string') return defaultvalue;
  const parseNumber = parseInt(number);
  if (Number.isNaN(parseNumber)) return defaultvalue;
  return parseNumber;
};

export const parsePaginationParams = ({ page, perPage }) => {
  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(page, 1);
  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
