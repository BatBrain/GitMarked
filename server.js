"use strict";

require('dotenv').config();
const http = require('http')

const PORT                  = process.env.PORT || 8080;
const ENV                   = process.env.ENV || "development";
const express               = require("express");
const bodyParser            = require("body-parser");
const sass                  = require("node-sass-middleware");
const app                   = express();
const morgan                = require('morgan');
const passport              = require("passport");
const flash                 = require('connect-flash');
const cookieParser          = require('cookie-parser');
const expressSession        = require("express-session");
const GitHubStrategy        = require("passport-github2").Strategy;
const methodOverride        = require("method-override");
const handlebars            = require('handlebars');
const exphbs                = require('express-handlebars');
// const partial               = require('express-partials');
const chalk                 = require("chalk");
const request               = require("request");
const oauth2strategy        = require("passport-oauth2");

const db                    = require('./db/models/index');

const GITHUB_CLIENT_ID      = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET  = process.env.GITHUB_CLIENT_SECRET

//const usersRoutes = require("./routes/users");
function log(text){console.log(chalk.black.bgYellow.bold(text))};


//=== Strategy ===================================================================

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log(obj)
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/github/callback",
  },
  function(accessToken, refreshToken, profile, done) {
    log("GitHub returned something! Huzzah!");
    log("accessToken:");
    console.log(accessToken);
    log("profile: ", profile);
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

// Includes sequelize
// var Sequelize = require('sequelize')
//   , sequelize = new Sequelize(ENV.DB_NAME, ENV.DB_USER, ENV.DB_PASS, {
//       host: ENV.DB_HOST,
//       dialect: 'postgres',
//       port: ENV.DB_PORT
//     });

// sequelize
//   .authenticate()
//   .then(function(err) {
//     console.log('Connection has been established successfully.');
//   }, function (err) {
//     console.log('Unable to connect to the database:', err);
//   });

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.


//=== MiddleWare ===================================================================

app.use(morgan('dev'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// app.set("view engine", "ejs");
// app.use(partial());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.static("codemirror"))
app.use(expressSession({ secret: 'wJWnfa2C7EjSSGpY', resave: false, saveUninitialized: false }));
app.use(flash());

app.use(passport.initialize());
//app.use(passport.session({ secret: 'wJWnfa2C7EjSSGpY', resave: false, saveUninitialized: false }));
app.use(passport.session());


//=== GitHub OAuth ===================================================================

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user', 'repo' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  });

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    req._parsedUrl.query

    res.redirect('/');
});


//=== ROUTES ===================================================================

app.get("/", (req, res) => {
  res.render('index', { user: req.user });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/account', ensureAuthenticated, function(req, res){
  // http.get('https://api.github.com/repos/a-taranenko/math_game/git/trees');
  res.render('account', { user: req.user });
});

app.get('/account/userinfo', ensureAuthenticated, function(req, res) {
  res.send(req.user._json)
})

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

app.get('/currentUser', ensureAuthenticated, function(req, res){
  res.send(req.user)
})

app.get('/codemirror2', ensureAuthenticated, function(req, res){
  request(JSON.parse(req.user._raw).repos_url), (error, response, body) => {
    res.render('codemirror2', { user: req.user, resBody: body });
  }
  res.render('codemirror', { user: req.user });
})


//=== MW Functions ===================================================================

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("User Authenticated")
    return next()
  } else {
    res.redirect('/login')
  }
}


//=== Listen ===================================================================

app.listen(PORT, () => {
  console.log("GitMarked listening on port " + PORT);
});
