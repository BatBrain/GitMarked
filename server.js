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

const GITHUB_CLIENT_ID      = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET  = process.env.GITHUB_CLIENT_SECRET
// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8080"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(err, user);
    });
  }
));


app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
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
app.use(methodOverride());

app.use(passport.initialize());
app.use(passport.session({ secret: 'wJWnfa2C7EjSSGpY', resave: false, saveUninitialized: false }));
app.use(passport.session());

//=== ROUTES ===================================================================
// Home page
app.get("/", (req, res) => {
  res.render("layout");
});

//GitHub OAuth
app.get('/auth/github',
passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback',
passport.authenticate('github', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
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

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}


app.listen(PORT, () => {
  console.log("GitMarked listening on port " + PORT);
});
