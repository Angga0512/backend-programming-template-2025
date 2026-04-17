module.exports = (mongoose) => {
  const prizeSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
      },
      maxWinners: {
        type: Number,
        required: true,
      },
      currentWinners: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

  return mongoose.model('Prize', prizeSchema);
};
