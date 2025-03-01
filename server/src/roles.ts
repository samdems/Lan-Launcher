export type Role = 'admin' | 'user' | 'anonymous';

export type Permissions = {
  create?: Role[];
  read?: Role[];
  update?: Role[];
  delete?: Role[];
  list?: Role[];
};

export type AllRoles = {
  users: Permissions;
  games: Permissions;
};

export const rolesMap: AllRoles = {
  users: {
    create: ['admin'],
    read: ['admin', 'user'],
    update: ['admin', 'user'],
    delete: ['admin'],
  },
  games: {
    create: ['admin'],
    read: ['admin', 'anonymous'],
    update: ['admin'],
    delete: ['admin'],
    list: ['admin'],
  },
};

export const hasPermission = (
  role: Role,
  resource: keyof AllRoles,
  action: keyof Permissions
): boolean => {
  if (!rolesMap[resource]) {
    return false;
  }

  if (!rolesMap[resource][action]) {
    return false;
  }

  return rolesMap[resource][action].includes(role);
};

