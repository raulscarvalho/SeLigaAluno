const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');

dotenv.config();

const feedRouter = require('./routes/feed');
const eventosRouter = require('./routes/eventos');
const guiaifRouter = require('./routes/guiaif');
const menuRouter = require('./routes/menu');
const secjacRouter = require('./routes/secjac');
const authRouter = require('./routes/auth');        // login e logout
const postRouter = require('./routes/posts');       // criação de posts
const cadastroRouter = require('./routes/cadastro'); // cadastro
const perfilRouter = require('./routes/perfil');

const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado ao MongoDB");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error);
  }
};
connectDB();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(session({
  secret: 'segredo-supersecreto',
  resave: false,
  saveUninitialized: true
}));

// Middleware para deixar o usuário disponível nas views
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

app.use('/posts', postRouter);
app.use('/', authRouter);
app.use('/cadastro', cadastroRouter);
app.use('/', feedRouter);
app.use('/eventos', eventosRouter);
app.use('/guiaif', guiaifRouter);
app.use('/menu', menuRouter);
app.use('/secjac', secjacRouter);
app.use('/perfil', perfilRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
