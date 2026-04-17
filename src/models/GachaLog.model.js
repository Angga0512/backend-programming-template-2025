module.exports = (mongoose) => {
  const gachaLogSchema = new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      prize: {
        type: String,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

  // Index untuk query daily limit biar cepet
  gachaLogSchema.index({ userId: 1, timestamp: 1 });

  return mongoose.model('GachaLog', gachaLogSchema);
};
