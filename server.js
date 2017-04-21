"use strict";
// test test test
//require('dotenv').config();
const http = require('http')

const PORT                  = process.env.PORT || 8080;
const ENV                   = process.env.ENV || "development";
const express               = require("express");
const bodyParser            = require("body-parser");
var lessMiddleware          = require('less-middleware');
//const sass                  = require("node-sass-middleware");
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
const request               = require("request");
const oauth2strategy        = require("passport-oauth2");
const Student               = require('./db/models/student');
const Mentor                = require('./db/models/mentor');
const Assignment            = require('./db/models/assignment');
const Submitted_Assignment  = require('./db/models/submitted_assignment');
const Comment               = require('./db/models/comment');
const File                  = require('./db/models/file');

const GITHUB_CLIENT_ID      = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET  = process.env.GITHUB_CLIENT_SECRET

//const usersRoutes = require("./routes/users");
function log(text){console.log(chalk.black.bgYellow.bold(text))};


//=== Strategy ===================================================================

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  //console.log(obj)
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "https://gitmarked.herokuapp.com/auth/github/callback",
  },
  function(accessToken, refreshToken, profile, done) {
    log("GitHub returned something! Huzzah!");
    log("accessToken:");
    //console.log(accessToken);
    log("profile: ", profile);
    process.nextTick(function () {
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
app.use(methodOverride("_method"));
app.use(cookieParser());
// app.use(lessMiddleware(__dirname + '/stylesheets', [{
//   debug: true,
//    dest: (__dirname + "/styles"),
//    pathRoot: (__dirname, 'public')
// }]));
// app.use("/styles", sass({
//   src: __dirname,
//   dest: __dirname + "/public/styles",
//   debug: true,
//   outputStyle: 'expanded',
//   includePaths: [ '/node_modules/octicons/',  "/styles" ],
// }));
app.use(expressSession({ secret: 'wJWnfa2C7EjSSGpY', resave: false, saveUninitialized: false }));
app.use(express.static("public"));
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
    if (req.user.username == 'a-taranenko') {
      res.redirect('/dashboard/mentor');
    } else if (req.user.username == 'BatBrain') {
      res.redirect('/dashboard/mentor');
    } else if (req.user.username == 'FrankyTest') {
      res.redirect('/dashboard/student');
    } else {
      res.redirect('/dashboard/student');
    }
});

//=== ROUTES ===================================================================

app.get("/", (req, res) => {
  // Student.findOne().then(function(user) {
  //   console.log(user.get('first_name'));
  // });

  res.render('index', { layout:false });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/account', ensureAuthenticated, function(req, res){
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

app.get('/codemirror2/:id', ensureAuthenticated, function(req, res){
  var assignmentList;
  var submittedAssignmentUrl;
  var submittedAssignmentID;

  Submitted_Assignment.findAll({
    attributes: [
      'id',
      'assignment_url',
      'status',
      'assignment_id',
      'student_id',
      'mentor_id'
      ],
    where: {
      id: req.params.id
    },
    include: [
      { model: Assignment },
      { model: Student },
      { model: Mentor }
      ]
    })
    .then(function(e) {
      console.log('========URL==========>>>', e[0].dataValues.assignment_url, '=========URL=========');
      submittedAssignmentUrl = e[0].dataValues.assignment_url;
      submittedAssignmentID = e[0].dataValues.id;
      Assignment.findAll({ attributes: ['id', 'name', 'description'] })
    .then(function(e) {
      assignmentList = e;
      if (req.user.username == 'a-taranenko') {
        res.render('codemirror-mentor', { user: req.user, sub_id: submittedAssignmentID, assignment: assignmentList, repoURL: JSON.stringify(makeFetchUrl(submittedAssignmentUrl)) });
      } else if (req.user.username == 'BatBrain') {
        res.render('codemirror-mentor', { user: req.user, sub_id: submittedAssignmentID, assignment: assignmentList, repoURL: JSON.stringify(makeFetchUrl(submittedAssignmentUrl)) });
      } else if (req.user.username == 'FrankyTest') {
        res.render('codemirror', { user: req.user, sub_id: submittedAssignmentID, assignment: assignmentList, repoURL: JSON.stringify(makeFetchUrl(submittedAssignmentUrl)) });
      } else {
        res.render('codemirror', { user: req.user, sub_id: submittedAssignmentID, assignment: assignmentList, repoURL: JSON.stringify(makeFetchUrl(submittedAssignmentUrl)) });
      }
    });
  });
  // Assignment.findAll({ attributes: ['id', 'name', 'description'] }).then(function(e) {
  //   assignmentList = e;
  //   res.render('codemirror', { user: req.user, assignment: assignmentList, repoURL: "https://api.github.com/repos/BatBrain/ar-excercises/git/trees/aef6baccc89b2a11545438510c379b6034aa189f?recursive=1" });
  // });
})

app.get('/dashboard/student', ensureAuthenticated, function(req, res){
  var assignmentList;

  Assignment.findAll({ attributes: ['id', 'name', 'description'] }).then(function(e) {
    assignmentList = e;
    res.render('dashboard-student', { user: req.user, assignment: assignmentList, repoURL: undefined });
  });
});

app.get('/dashboard/mentor', ensureAuthenticated, function(req, res){
  var assignmentList;
  Assignment.findAll({ attributes: ['id', 'name', 'description'] }).then(function(e) {
    assignmentList = e;
    res.render('dashboard-mentor', { user: req.user, assignment: assignmentList, repoURL: undefined });
  });
});

app.get('/mentor/assignments/:id', ensureAuthenticated, function(req, res){
  var submittedAssignmentList;
  var assignmentList;

  Submitted_Assignment.findAll({
    attributes: [
      'id',
      'assignment_url',
      'status',
      'assignment_id',
      'student_id',
      'mentor_id'
      ],
    where: {
      assignment_id: req.params.id
    },
    include: [
      { model: Assignment },
      { model: Student },
      { model: Mentor }
      ]
    })
    .then(function(e) {
      submittedAssignmentList = e;
      Assignment.findAll({ attributes: ['id', 'name', 'description'] })
    .then(function(e) {
        assignmentList = e;
        res.render('assignment', { user: req.user, assignment: assignmentList, submittedAssignment: submittedAssignmentList, repoURL: undefined });
    });
  });
// { model: Assignment,
//       attributes: [] }
});

app.get('/student/assignments/:id', ensureAuthenticated, function(req, res){
  var submittedAssignmentList;
  var assignmentList;
  var submittedAssignmentUrl;
  var repoURLContainer;

  Student.findAll({
    attributes: [
      'id',
      'github_name'
    ],
    where: {
      github_name: req.user.username
    }
  })
  .then(function(e) {
    var studentIdentification = e[0].dataValues.id

    Submitted_Assignment.findAll({
      attributes: [
        'id',
        'assignment_url',
        'status',
        'assignment_id',
        'student_id',
        'mentor_id'
        ],
      where: {
        assignment_id: req.params.id,
        student_id: studentIdentification
      },
      include: [
        { model: Assignment },
        { model: Student },
        { model: Mentor }
        ]
      })
      .then(function(e) {
        submittedAssignmentList = e;

        if (e[0]) {
          submittedAssignmentUrl = e[0].dataValues.assignment_url;
        } else {
          submittedAssignmentUrl = undefined;
        }

        Assignment.findAll({ attributes: ['id', 'name', 'description'] })
        .then(function(e) {
          assignmentList = e;

          if (submittedAssignmentUrl) {
            repoURLContainer = JSON.stringify(makeFetchUrl(submittedAssignmentUrl));
          } else {
            repoURLContainer = undefined;
          }
          if (submittedAssignmentList[0]) {
            res.render('assignment-student', {
              user: req.user,
              assignment: assignmentList,
              submittedAssignment: submittedAssignmentList,
              repoURL: repoURLContainer,
              assignmentId: req.params.id,
              userId: studentIdentification })
          } else {
            res.render("submitbutton", {
              user: req.user,
              assignment: assignmentList,
              repoURL: repoURLContainer,
              assignmentId: req.params.id,
              userId: studentIdentification
            })
          }
        })
      })
})

app.post('/dashboard/student', ensureAuthenticated, function(req, res){

  console.log('=====REQ-PARAMS-POST=====>>>>>', req.body, '===END=1===');

  Submitted_Assignment.bulkCreate([
    { assignment_url: req.body.github_url,
      status: 'Submitted',
      createdAt: new Date(),
      updatedAt: new Date(),
      assignment_id: req.body.assignment_id,
      student_id: req.body.user_id}
    ])
  .then(function() {
    res.redirect('/dashboard/student');
  })
});

app.delete('/dashboard/student/:id', ensureAuthenticated, function(req, res){

  console.log('=====REQ-PARAMS-DELETE=====>>>>>', req.params.id, '===END=2===');

  Submitted_Assignment.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(function() {
    res.redirect('/dashboard/student');
  })
})
})

app.get ('/find/filecomments', ensureAuthenticated, function(req, res) {
  File.findAll({
    attributes: [
      'id',
      'comments'
    ],
    where: {
      file_path: req.query.path,
      sub_assign_id: req.query.id
    }
  }).then(function(fileData) {
    var myCommentArray = fileData[0].dataValues.comments;
    var myFileId = fileData[0].dataValues.id;

    Comment.findAll({
      attributes: [
        'title',
        'text',
        'line_start',
        'line_end',
        'type'
      ],
      where: {
        file_id: myFileId
      }
    }).then(function(commentData) {
      var commentArray = commentData; //to access something use: commentArray[YOUR INDEX].dataValues.line_start
      res.send(commentArray)
    })
  })
})

app.post("/addNewComment", function(req, res){
  console.log(req.body)
  Submitted_Assignment.findAll({
    attributes: [
      'status'
    ],
    where: {
      id: req.body.subID
    }
  })
  .then(function(subAssignData) {
    if (subAssignData[0].dataValues.status == 'Submitted') {
      Submitted_Assignment.updateAttributes({
        status: 'Marked'
      })
    }

    File.findOrCreate({
      where: {
        file_path: req.body.path,
        sub_assign_id: req.body.subID
      },
      defaults: {
        file_path: req.body.path,
        sub_assign_id: req.body.subID
      }
    })
    .then(function(row, trueOrFalse) {
      Comment.create({
          title: req.body.title,
          text: req.body.text,
          type: req.body.type,
          sub_assign_id: req.body.subID,
          line_uri: "no one cares about this right now",
          line_start: req.body.line_start,
          line_end: req.body.line_end,
          file_id: row[0].dataValues.id
        })
      .then(function(row) {
        console.log(row)
        res.sendStatus(200)
      })
    })
  })
})
//=== MW Functions ===================================================================

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("User Authenticated")
    return next()
  } else {
    res.redirect('/')
  }
}


//=== Listen ===================================================================

app.listen(PORT, () => {
  console.log("GitMarked listening on port " + PORT);
});


function makeFetchUrl(submittedURL){
  let sliced = submittedURL.replace("https://github.com/", "").split("/").slice(0,2)
  let username = sliced[0]
  let reponame = sliced[1]
  let resultObj = {
    username: username,
    reponame: reponame,
    treeURL: `https://api.github.com/repos/${username}/${reponame}/git/trees/master?recursive=1`,
    sourceURL: submittedURL
  }
  console.log(resultObj)
  return resultObj
}

// File.findAll({
//   attributes: [
//     'id',
//     'comments'
//   ],
//   where: {
//     file_path: "YOUR FILE PATH HERE",
//     sub_assign_id: "YOUR SUBMITTED ASSIGNMENT ID HERE"
//   }
// }).then(function(fileData) {
//   var myCommentArray = fileData[0].dataValues.comments;
//   var myFileId = fileData[0].dataValues.id;

//   Comment.findAll({
//     attributes: [
//       'title',
//       'text',
//       'line_start',
//       'line_end'
//     ],
//     where: {
//       file_id: myFileId
//     }
//   }).then(function(commentData) {
//     var commentArray = commentData; //to access something use: commentArray.[YOUR INDEX].dataValues.line_start
//   })
// })

// Submitted_Assignment.findAll({
//   attributes: [
//     'status'
//   ],
//   where: {
//     id: 'GIVE_THE_ID_HERE'
//   }
// })
// .then(function(subAssignData) {
//   if (subAssignData[0].dataValues.status == 'Submitted') {
//     Submitted_Assignment.updateAttributes({
//       status: 'Marked'
//     })
//   }
//
//   File.findOrCreate({
//     file_path: 'GIVE_THE_FILE_PATH_HERE',
//     sub_assign_id: 'GIVE_THE_SUB_ASSIGN_ID_HERE'
//   })
//   .then(function(row, trueOrFalse) {
//     Comment.bulkCreate([
//       {
//         title: '',
//         text: '',
//         type: '',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         sub_assign_id: '',
//         line_start: ,
//         line_end: ,
//         file_id:
//       }
//     ])
//     .then(function() {
//       res.render()
//     })
//   })
// })
