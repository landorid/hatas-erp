const transformError = (error) => {
  const errorMessage = error.message.replace('GraphQL error: ', '');
  switch (errorMessage) {
    case 'NO_USER_FOUND':
      return 'Nincs ilyen felhasználó!';
    case 'INVALID_PASSWORD':
      return 'Helytelen jelszó!';
    case 'INVALID_OLD_PASSWORD':
      return 'Helytelen jelszó!';
    default:
      return errorMessage;
  }
};

const handleError = (error, setErrors, possibleErrorArray) => {
  const errorMessage = error.message.replace('GraphQL error: ', '');
  const [errorItem] = possibleErrorArray.filter(item => item.err === errorMessage);

  setErrors({ [errorItem.input]: transformError(error) });
};

export { transformError };
export { handleError };
