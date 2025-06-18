var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var Post = require('./post.js');
var feedRouter = require('./routes/feed');
var eventosRouter = require('./routes/eventos');
var guiaifRouter = require('./routes/guiaif');
var menuRouter = require('./routes/menu');
var secjacRouter = require('./routes/secjac');

dotenv.config();

var app = express();

app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado ao MONGODB");
  } catch (error) {
    console.log("ERRO AO CONECTAR AO MONGODB", error);
  }
}

connectDB();

// CREATE
app.post("/", async (req, res) => {
  try {
    const novoPost = await Post.create(req.body);
    res.json(novoPost);
    res.render('feed');
  } catch(error) {
    res.json({ error: error });
  }
});

//GET
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    console.log(posts);
    res.render('feed');
  } catch (error) {
    res.json({error : error})
  }
})

// UPDATE 
app.put("//:id", async (req, res) => {
  try {
    const novoPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new : true }
    );
    res.json(novoPost);
  } catch (error) {
    res.json({error : error})
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', feedRouter);
app.use('/eventos', eventosRouter);
app.use('/guiaif', guiaifRouter);
app.use('/menu', menuRouter);
app.use('/secjac', secjacRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
