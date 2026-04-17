const models = require('../../../models');

const { Prize } = models;
const { GachaLog } = models;
const User = models.Users;

const gachaRepository = {
  async seedPrizes() {
    const prizesData = [
      { name: 'Emas 10 gram', maxWinners: 1 },
      { name: 'Smartphone X', maxWinners: 5 },
      { name: 'Smartwatch Y', maxWinners: 10 },
      { name: 'Voucher Rp100.000', maxWinners: 100 },
      { name: 'Pulsa Rp50.000', maxWinners: 500 },
    ];

    for (const data of prizesData) {
      const existing = await Prize.findOne({ name: data.name });
      if (!existing) {
        await Prize.create(data);
        console.log(`✅ Prize seeded: ${data.name}`);
      }
    }
    console.log('🎉 Semua hadiah berhasil di-seed!');
  },

  async findUserByEmail(email) {
    return await User.findOne({ email }).lean();
  },

  async getAvailablePrizes() {
    return await Prize.find({
      $expr: { $lt: ['$currentWinners', '$maxWinners'] },
    }).lean();
  },

  async incrementPrizeWinner(prizeName) {
    return await Prize.findOneAndUpdate(
      { name: prizeName, $expr: { $lt: ['$currentWinners', '$maxWinners'] } },
      { $inc: { currentWinners: 1 } },
      { new: true }
    );
  },

  async createGachaLog(userId, username, prize = null) {
    return await GachaLog.create({ userId, username, prize });
  },

  async countDailyAttempts(userId) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    return await GachaLog.countDocuments({
      userId,
      timestamp: { $gte: todayStart, $lt: todayEnd },
    });
  },

  async getUserHistory(userId) {
    return await GachaLog.find({ userId }).sort({ timestamp: -1 }).lean();
  },
};

module.exports = gachaRepository;
