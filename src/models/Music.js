const mongoose = require('mongoose');

const MusicSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    artista: { type: String, required: true },
    genero: { type: String, required: true },
    capa: { type: String, required: true },
    data_lancamento: { type: Date, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Music', MusicSchema);
