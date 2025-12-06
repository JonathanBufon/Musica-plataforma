const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

const Music = require('./src/models/Music');
const User = require('./src/models/User');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://root:root@localhost:27017/music_platform?authSource=admin';
const DEFAULT_USER_EMAIL = process.env.DEFAULT_USER_EMAIL || 'admin@teste.com';
const DEFAULT_USER_NAME = process.env.DEFAULT_USER_NAME || 'Administrador';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function resolveActiveEmail(req) {
  return req.cookies?.userEmail || DEFAULT_USER_EMAIL;
}

async function ensureUser(email) {
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      nome: email === DEFAULT_USER_EMAIL ? DEFAULT_USER_NAME : 'Novo Usuário',
      email,
      generos_preferidos: [],
      favoritos: []
    });
  }
  return user;
}

app.get('/', async (req, res, next) => {
  try {
    const filterGenre = req.query.filtro || '';
    const activeEmail = resolveActiveEmail(req);
    const user = await ensureUser(activeEmail);
    const favoriteObjectIds = user ? user.favoritos : [];
    const favoriteIds = favoriteObjectIds.map((fav) => fav.toString());

    let recommendedMusics = [];
    if (user && user.generos_preferidos.length) {
      recommendedMusics = await Music.find({ genero: { $in: user.generos_preferidos } }).sort({ createdAt: -1 });
    }

    const recommendedIds = recommendedMusics.map((music) => music._id);
    const excludedIds = [...recommendedIds, ...favoriteObjectIds];

    const exploreFilter = {};
    if (excludedIds.length) {
      exploreFilter._id = { $nin: excludedIds };
    }
    if (filterGenre) {
      exploreFilter.genero = filterGenre;
    }

    const exploreMusics = await Music.find(exploreFilter).sort({ createdAt: -1 });
    const genres = await Music.distinct('genero');

    res.render('home', {
      user,
      recommendedMusics,
      exploreMusics,
      favoriteIds,
      genres,
      activeFilter: filterGenre
    });
  } catch (error) {
    next(error);
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res, next) => {
  try {
    const emailInput = req.body.email?.trim();
    const email = emailInput || DEFAULT_USER_EMAIL;
    const user = await ensureUser(email);

    res.cookie('userEmail', user.email, { httpOnly: false });

    if (!user.generos_preferidos.length) {
      return res.redirect('/onboarding');
    }

    return res.redirect('/');
  } catch (error) {
    next(error);
  }
});

app.get('/onboarding', async (req, res, next) => {
  try {
    const activeEmail = resolveActiveEmail(req);
    const user = await ensureUser(activeEmail);
    const availableGenres = await Music.distinct('genero');
    res.render('onboarding', {
      availableGenres,
      selectedGenres: user?.generos_preferidos || []
    });
  } catch (error) {
    next(error);
  }
});

app.post('/onboarding', async (req, res, next) => {
  try {
    const rawGenres = req.body.generos;
    const parsedGenres = Array.isArray(rawGenres) ? rawGenres : rawGenres ? [rawGenres] : [];
    const uniqueGenres = [...new Set(parsedGenres)].filter(Boolean);

    const activeEmail = resolveActiveEmail(req);
    const user = await ensureUser(activeEmail);

    user.generos_preferidos = uniqueGenres;
    await user.save();

    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

app.get('/favoritar/:id', async (req, res, next) => {
  try {
    const musicId = req.params.id;
    const activeEmail = resolveActiveEmail(req);
    const user = await ensureUser(activeEmail);

    if (!user) {
      return res.redirect('/');
    }

    const index = user.favoritos.findIndex((favId) => favId.toString() === musicId);
    if (index === -1) {
      user.favoritos.push(musicId);
    } else {
      user.favoritos.splice(index, 1);
    }

    await user.save();
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Erro interno do servidor');
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado ao MongoDB');

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar no MongoDB:', error);
    process.exit(1);
  }
}

start();
