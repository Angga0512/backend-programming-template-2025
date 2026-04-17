const jwt = require('jsonwebtoken');

const authRepository = require('./auth-repository');
const { passwordMatched } = require('../../../utils/password');

function generateToken(email) {
  const jwtSecret = 'RANDOM_STRING';

  return jwt.sign(
    {
      email,
      timestamp: Date.now(),
    },
    jwtSecret,
    {
      expiresIn: '1d',
    }
  );
}

async function checkLoginCredentials(email, password) {
  const user = await authRepository.getUserByEmail(email);

  const userPassword = user ? user.password : '<RANDOM_FILLER>';
  const loginPassed = await passwordMatched(password, userPassword);

  if (user && loginPassed) {
    return {
      email: user.email,
      fullName: user.fullName,
      token: generateToken(email),
    };
  }

  return null;
}

module.exports = {
  checkLoginCredentials,
};
