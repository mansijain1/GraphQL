const users = new Map();

function getUser(id) {
  return users.get(id);
}

function getAllUsers() {
  return Array.from(users.values());
}

function addUser(user) {
  users.set(user.id, user);
}

function updateUser(id, newData) {
  if (!users.has(id)) return null;
  const existingUser = users.get(id);
  const updatedUser = { ...existingUser, ...newData };
  users.set(id, updatedUser);
  return updatedUser;
}

function deleteUser(id) {
  if (!users.has(id)) return null;
  const deletedUser = users.get(id);
  users.delete(id);
  return deletedUser;
}


module.exports = { addUser, getUser, getAllUsers , updateUser, deleteUser};
