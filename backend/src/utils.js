const { AuthenticationError } = require('apollo-server');

function hasPermission(permissions, permissionsNeeded) {
  const matchedPermissions = permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave),
  );

  if (!matchedPermissions.length) {
    throw new AuthenticationError(`Szükséges jogkör: ${permissionsNeeded}, amivel rendelkezel: ${permissions}`);
  }
}

function authHelper(req) {
  if (!req.userId) {
    throw new AuthenticationError('Lépj be!');
  }
}

exports.hasPermission = hasPermission;
exports.authHelper = authHelper;
