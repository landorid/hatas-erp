import { roles, permissions } from '../config';

const getRoleName = (roleName) => {
  const [foundRole] = roles.filter(role => role.id === roleName);
  return foundRole.name;
};

const getPermission = (permission) => {
  const [foundPermission] = permissions.filter(p => p.id === permission);
  return foundPermission.name;
};

export { getRoleName };
export { getPermission };