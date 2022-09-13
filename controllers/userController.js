const getAllUsers = async (req, res) => {
  res.send("get All User");
};

const getSingleUser = async (req, res) => {
  res.send("Get Single User");
};

const showCurrentUser = async (req, res) => {
  res.send("Show current user");
};

const updateUserInfo = async (req, res) => {
  res.send("Update User");
};

const updatePassword = async (req, res) => {
  res.send("Update Password");
};

const deleteUser = async (req, res) => {
  res.send("Delete User");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserInfo,
  updatePassword,
  deleteUser,
};
