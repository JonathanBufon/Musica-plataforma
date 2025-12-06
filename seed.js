const mongoose = require('mongoose');
const Music = require('./src/models/Music');
const User = require('./src/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://root:root@localhost:27017/music_platform?authSource=admin';

const sampleGenres = [
  'Rock',
  'Pop',
  'Pagode',
  'Samba',
  'MPB',
  'Hip Hop',
  'Eletrônica',
  'Sertanejo',
  'Funk',
  'Jazz'
];

const sampleCovers = [
  'https://placehold.co/400x400?text=Rock',
  'https://placehold.co/400x400?text=Pop',
  'https://placehold.co/400x400?text=Pagode',
  'https://placehold.co/400x400?text=Samba',
  'https://placehold.co/400x400?text=MPB',
  'https://placehold.co/400x400?text=HipHop',
  'https://placehold.co/400x400?text=Eletronica',
  'https://placehold.co/400x400?text=Sertanejo',
  'https://placehold.co/400x400?text=Funk',
  'https://placehold.co/400x400?text=Jazz'
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);

    await Music.deleteMany({});
    await User.deleteMany({});

    const musicData = Array.from({ length: 20 }).map((_, index) => {
      const genreIndex = index % sampleGenres.length;
      return {
        titulo: `Música ${index + 1}`,
        artista: `Artista ${index + 1}`,
        genero: sampleGenres[genreIndex],
        capa: sampleCovers[genreIndex],
        data_lancamento: new Date(2010 + index, 0, 1)
      };
    });

    const musics = await Music.insertMany(musicData);

    const preferredGenres = ['Rock', 'Pop'];
    const favorites = musics.filter(music => preferredGenres.includes(music.genero)).slice(0, 4);

    await User.create({
      nome: 'Administrador',
      email: 'admin@teste.com',
      generos_preferidos: preferredGenres,
      favoritos: favorites.map(music => music._id)
    });

    console.log('Seed concluído com sucesso.');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Erro ao executar seed:', error);
    process.exit(1);
  }
}

seed();
