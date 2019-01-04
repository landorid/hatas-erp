const { AuthenticationError } = require('apollo-server');

function hasPermission(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave),
  );

  if (!matchedPermissions.length) {
    throw new AuthenticationError(`Szükséges jogkör: ${permissionsNeeded}, amivel rendelkezel: ${user.permissions}`);
  }
}

exports.hasPermission = hasPermission;
