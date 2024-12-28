const parseBoolean = (typeParams) => {
  if (typeParams === 'true') return true;
  if (typeParams === 'false') return false;
  return;
};

export const filterContactsParams = ({ type, isFavourite }) => {

  const isFavouriteBolean = parseBoolean(isFavourite);
  const typeContact = type;

 console.log(type, 'In Filter');
 
  return {
    type: typeContact,
    isFavourite: isFavouriteBolean,
  };
};
