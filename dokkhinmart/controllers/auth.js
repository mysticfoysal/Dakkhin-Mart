const register = (req, res) => {
  res.json({ message: 'Register working' });
};

const login = (req, res) => {
  res.json({ message: 'Login working' });
};

const getProfile = (req, res) => {
  res.json({ message: 'Profile data' });
};

const updateProfile = (req, res) => {
  res.json({ message: 'Profile updated' });
};

const changePassword = (req, res) => {
  res.json({ message: 'Password changed' });
};

const getMyOrders = (req, res) => {
  res.json({ message: 'My orders list' });
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getMyOrders
};