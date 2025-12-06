const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    generos_preferidos: [{ type: String }],
    favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Music' }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', UserSchema);
