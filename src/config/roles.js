const roles = [ 'admin','user'];

const roleRights = new Map();
roleRights.set(roles[0], ['getFiles', 'manageFiles', 'downloadFile']);
roleRights.set(roles[1], ['getUsers', 'manageUsers']);

module.exports = {
  roles,
  roleRights,
};
