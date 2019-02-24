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
    return true;
  });
};

const hasPermission = (permissions, permissionsNeeded) => {
  if (!permissions) {
    return false;
  }
  const matchedPermissions = permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave),
  );

  return !!matchedPermissions.length;
};

/*
* Flat StockItem Categories map to parent - children array
 */
const createCategoryTree = (cat) => {
  if (!cat) return [];
  const categories = JSON.parse(JSON.stringify(cat));

  let newMainCategories = categories.reduce((arr, item) => {
    if (!item.parent) {
      arr.push({ ...item, children: [] });
    }
    return arr;

  }, []);
  categories.forEach(item => {
    if (item.parent) {
      const index = newMainCategories.findIndex(elem => elem.id === item.parent.id);
      delete item.parent;
      newMainCategories[index].children.push(item);
    }
  });
  
  // newMainCategories.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  return newMainCategories;
};

export {
  getRoleName,
  handleErrors,
  getPermission,
  hasPermission,
  createCategoryTree,
};
