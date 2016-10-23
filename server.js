"use strict";

require('dotenv').config();

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
const ejs                   = require("ejs");
const partial               = require('express-partials');
const chalk                 = require("chalk");


const GITHUB_CLIENT_ID      = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET  = process.env.GITHUB_CLIENT_SECRET

//const usersRoutes = require("./routes/users");
function log(text){console.log(chalk.black.bgYellow.bold(text))};


//=== Strategy ===================================================================

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      log("GitHub returned something! Huzzah!");
      // console.log("refreshToken: \n", refreshToken);
      // console.log("accessToken: \n", accessToken);
      // console.log("profile: \n", profile);
      debugger
      return done(null, profile);
    });
  }
));


//=== MiddleWare ===================================================================

app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(partial());
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
  //console.log("REQ HERE:", req)
  //console.log("RES HERE:", res)
  // Successful authentication, redirect home.
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
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});


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
