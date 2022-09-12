const register = async (req, res) => {
  res.send("register");
};

const login = async (req, res) => {
  res.send("login");
};

const logout = async (req, res) => {
  res.send("logout");
};

const verifyEmail = async (req, res) => {
  res.send("verify Email");
};

const forgotPassword = async (req, res) => {
  res.send("forgot password");
};

const resetPassword = async (req, res) => {
  res.send("reset password");
};

module.exports = {
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  register,
};
