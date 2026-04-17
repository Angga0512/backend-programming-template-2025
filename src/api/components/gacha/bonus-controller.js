const gachaService = require('./gacha-service');

const bonusController = {
  // Bonus 1: History gacha user
  async getHistory(req, res, next) {
    try {
      const { user } = req;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - Token tidak valid',
        });
      }

      const history = await gachaService.getUserHistory(user._id);

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Bonus 2: Remaining quota hadiah
  async getRemainingPrizes(req, res, next) {
    try {
      const { Prize } = require('../../../models');
      const prizes = await Prize.find().lean();

      const result = prizes.map((p) => ({
        name: p.name,
        maxWinners: p.maxWinners,
        remaining: p.maxWinners - p.currentWinners,
      }));

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Bonus 3: List winners dengan nama dimasking
  async getWinners(req, res, next) {
    try {
      const { GachaLog } = require('../../../models');
      const logs = await GachaLog.find({ prize: { $ne: null } })
        .sort({ timestamp: -1 })
        .lean();

      // Masking FIXED: First letter + *** + Last letter
      const maskName = (name) => {
        if (!name || typeof name !== 'string') return '***';

        const parts = name.trim().split(/\s+/);

        return parts
          .map((part) => {
            if (part.length <= 2) return part;

            const first = part[0];
            const last = part[part.length - 1];
            const middle = '*'.repeat(part.length - 2);

            return first + middle + last;
          })
          .join(' ');
      };

      const grouped = {};
      logs.forEach((log) => {
        if (!grouped[log.prize]) grouped[log.prize] = [];
        grouped[log.prize].push({
          maskedName: maskName(log.username),
          timestamp: log.timestamp,
        });
      });

      res.status(200).json({ success: true, data: grouped });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = bonusController;
