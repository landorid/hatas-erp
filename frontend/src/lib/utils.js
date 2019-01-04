import { roles, permissions } from '../config';

const getRoleName = (roleName) => {
  if (!roleName) {
    return;
  }

  const [foundRole] = roles.filter(role => role.id === roleName);
  return foundRole.name;
};

const getPermission = (permission) => {
  if (!permission) {
    return;
  }
  const [foundPermission] = permissions.filter(p => p.id === permission);
  return foundPermission.name;
};

const handleErrors = (errors, errorHandler) => {
  if (!errors || !errors.length) {
    return;
  }

  errors.filter(item => item.extensions.code === 'BAD_USER_INPUT').map(error => {
    const invalidArgs = error.extensions.exception.invalidArgs;
    if (invalidArgs) {
      Object.keys(invalidArgs).map(input => errorHandler({ [input]: invalidArgs[input] }));
    }
  });
};

const hasPermission = (user, permissionsNeeded) => {
  const matchedPermissions = user.permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave),
  );

  return !!matchedPermissions.length;
};

export {
  getRoleName,
  handleErrors,
  getPermission,
  hasPermission,
};
