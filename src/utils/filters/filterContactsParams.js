const parseBoolean = (typeParams) => {
  if (typeParams === 'true') return true;
  if (typeParams === 'false') return false;
  return;
};

export const filterContactsParams = ({ type, isFavourite }) => {
  const typeContact = parseBoolean(type);
  const isFavouriteContact = isFavourite || undefined;

  return {
    type: typeContact,
    isFavourite: isFavouriteContact,
  };
};
