const gachaRepository = require('./gacha-repository');

const gachaService = {
  async performGacha(user) {
    const username = user.fullName || user.full_name || 'User';

    const dailyAttempts = await gachaRepository.countDailyAttempts(user._id);
    if (dailyAttempts >= 5) {
      throw new Error(
        'Anda sudah mencapai batas maksimal 5 kali gacha hari ini'
      );
    }

    const availablePrizes = await gachaRepository.getAvailablePrizes();

    const winChance = Math.random() * 100;
    let prizeWon = null;

    if (winChance <= 40 && availablePrizes.length > 0) {
      const randomIndex = Math.floor(Math.random() * availablePrizes.length);
      const selectedPrize = availablePrizes[randomIndex];
      await gachaRepository.incrementPrizeWinner(selectedPrize.name);
      prizeWon = selectedPrize.name;
    }

    await gachaRepository.createGachaLog(user._id, username, prizeWon);

    return {
      success: true,
      message: prizeWon
        ? `Selamat! Anda mendapatkan ${prizeWon}`
        : 'Maaf, Anda tidak mendapatkan hadiah kali ini',
      prize: prizeWon,
    };
  },

  async getUserHistory(userId) {
    return await gachaRepository.getUserHistory(userId);
  },
};

module.exports = gachaService;
