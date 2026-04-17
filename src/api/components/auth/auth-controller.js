const authService = require('./auth-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function login(request, response, next) {
  try {
    const { email, password } = request.body;

    const loginResult = await authService.checkLoginCredentials(
      email,
      password
    );

    if (!loginResult) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    return response.status(200).json(loginResult);
  } catch (error) {
    return next(error);
  }
}

async function testProtected(request, response, next) {
  try {
    return response.status(200).json({ message: 'OK' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  testProtected,
};
