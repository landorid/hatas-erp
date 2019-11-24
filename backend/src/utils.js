const { AuthenticationError } = require('apollo-server');

function hasPermission(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave),
  );

  if (!matchedPermissions.length) {
    throw new AuthenticationError(`Szükséges jogkör: ${permissionsNeeded}, amivel rendelkezel: ${user.permissions}`);
  }
}

function authHelper(req) {
  if (!req.userId) {
    throw new AuthenticationError('Lépj be!');
  }
}

exports.hasPermission = hasPermission;
exports.authHelper = authHelper;
