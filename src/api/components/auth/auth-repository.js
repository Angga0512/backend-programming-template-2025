const { Users } = require('../../../models');

async function getUserByEmail(email) {
  return Users.findOne({ email });
}

module.exports = {
  getUserByEmail,
};
