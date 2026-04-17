const gachaController = require('./gacha-controller');
const bonusController = require('./bonus-controller');
const { authMiddleware } = require('../../middlewares');

module.exports = (router) => {
  router.post('/gacha', authMiddleware, gachaController.gacha);

  router.get('/gacha/history', bonusController.getHistory);
  router.get('/prizes/remaining', bonusController.getRemainingPrizes);
  router.get('/winners', bonusController.getWinners);
};
