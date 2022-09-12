const createUserPayload = (user) => {
  const name = user.lastName.concat(" ", user.firstName);
  return { name, userId: user._id, role: user.role };
};

module.exports = createUserPayload;
