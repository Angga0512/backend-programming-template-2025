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

      const maskName = (name) => {
        if (!name || typeof name !== 'string') return '***';

        const parts = name.trim().split(/\s+/);
        const maskedParts = parts.map((part) => {
          if (part.length <= 2) return part;

          const pattern = Math.floor(Math.random() * 4);

          switch (pattern) {
            case 0:
              return (
                part[0] + '*'.repeat(part.length - 2) + part[part.length - 1]
              );

            case 1:
              return `*${part.slice(1, -1)}*`;

            case 2:
              const midStart = Math.floor(part.length / 3);
              const midEnd = Math.floor((part.length * 2) / 3);
              return (
                part.slice(0, midStart) +
                '*'.repeat(midEnd - midStart) +
                part.slice(midEnd)
              );

            case 3:
              const masked = part.split('');
              const numToMask = Math.max(1, Math.floor(part.length * 0.6));
              const indices = new Set();
              while (indices.size < numToMask) {
                indices.add(Math.floor(Math.random() * part.length));
              }
              indices.forEach((i) => {
                if (masked[i] !== ' ') masked[i] = '*';
              });
              return masked.join('');

            default:
              return (
                part[0] + '*'.repeat(part.length - 2) + part[part.length - 1]
              );
          }
        });

        return maskedParts.join(' ');
      };

      const grouped = {};
      logs.forEach((log) => {
        if (!grouped[log.prize]) grouped[log.prize] = [];
        grouped[log.prize].push({
          maskedName: maskName(log.username),
          timestamp: log.timestamp,
        });
      });

      res.status(200).json({
        success: true,
        data: grouped,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = bonusController;
