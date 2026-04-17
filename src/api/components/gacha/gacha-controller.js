const gachaService = require('./gacha-service');

const gachaController = {
  async gacha(req, res, next) {
    try {
      const { user } = req;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - Token tidak valid',
        });
      }

      const result = await gachaService.performGacha(user);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = gachaController;
