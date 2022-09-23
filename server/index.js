"use strict";

const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const coursesDao = require("./DAOs/dao-courses.js");
const studentsDao = require("./DAOs/dao-students");
const studyplansDao = require("./DAOs/dao-studyplans");
const morgan = require("morgan");
const cors = require("cors");
const { body, validationResult, param } = require("express-validator");

// Passport related imports
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");

// init express
const app = express();
const port = 3001;

// set up the middlewares
app.use(morgan("dev"));
app.use(express.json());

// set up and enable cors
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

/*** Passport setup ***/

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    const user = await studentsDao.getStudent(username, password);
    if (!user) return cb(null, false, "Incorrect username or password.");

    return cb(null, user);
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

app.use(
  session({
    secret: "this is my secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.authenticate("session"));

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

/*** API SESSION ***/

// POST /api/sessions (calls the local strategy function)
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).send(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      return res.status(200).json(req.user);
    });
  })(req, res, next);
});

// GET /api/sessions/current
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});

// DELETE /api/session/current
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

/*** API COURSES ***/

// GET /api/courses
app.get("/api/courses", (request, response) => {
  coursesDao
    .getListCourses()
    .then((courses) => response.status(200).json(courses))
    .catch(() => response.status(500).end());
});

// PUT /api/courses
app.put(
  "/api/courses/:code",
  isLoggedIn,
  [body("enroll").isInt({ min: 0, max: 1 }), param("code").isString()],
  (request, response) => {
    if (!validationResult(request).isEmpty()) return res.status(422).end();
    const enroll = request.body.enroll;
    enroll
      ? coursesDao
          .incrementEnrolledStudents(request.params.code)
          .then(() => response.status(200).end())
          .catch(() => response.status(500).end())
      : coursesDao
          .decrementEnrolledStudents(request.params.code)
          .then(() => response.status(200).end())
          .catch(() => response.status(500).end());
  }
);

// GET /api/courses/incompatibles
app.get("/api/courses/incompatibles", (request, response) => {
  coursesDao
    .getListIncompatibleCourses()
    .then((courses) => response.status(200).json(courses))
    .catch(() => response.status(500).end());
});

/*** API STUDYPLAN ***/

// DELETE /api/studyplans/:id
app.delete(
  "/api/studyplans/:id",
  [param("id").isInt({ min: 1 })],
  isLoggedIn,
  (request, response) => {
    if (!validationResult(request).isEmpty()) return res.status(422).end();
    studyplansDao
      .deleteStudyPlan(request.params.id)
      .then(() => response.status(204).end())
      .catch(() => response.status(500).end());
  }
);

// POST /api/studyplans/:id
app.post(
  "/api/studyplans/:id",
  [
    body("courses").isArray(),
    body("partime").isBoolean(),
    param("id").isInt({ min: 1 }),
  ],
  isLoggedIn,
  (request, response) => {
    if (!validationResult(request).isEmpty()) return res.status(422).end();
    const coursesStudyPlan = request.body.courses; // course code

    // Check on the number of credits of the studyplan
    const credits = coursesStudyPlan
      .map((course) => course.credits)
      .reduce((c1, c2) => c1 + c2);
    const minCredits = request.body.partime ? 20 : 60;
    const maxCredits = request.body.partime ? 40 : 80;
    if (credits > maxCredits || credits < minCredits)
      return res.status(422).end();

    // Check on number of enrolled students
    const tooManyStudents = coursesStudyPlan
      .filter((course) => course.maxStudents != null)
      .some((course) => course.enrolledStudents + 1 > course.maxStudents);
    if (tooManyStudents) return res.status(422).end();

    for (const course of coursesStudyPlan) {
      studyplansDao
        .addStudyPlan(request.params.id, course)
        .catch(() => response.status(500).end());
    }
    return response.status(200).end();
  }
);

// GET /api/studyplans/:id
app.get(
  "/api/studyplans/:id",
  [param("id").isInt({ min: 1 })],
  isLoggedIn,
  (request, response) => {
    if (!validationResult(request).isEmpty()) return res.status(422).end();
    studyplansDao
      .getStudyPlan(request.params.id)
      .then((courses) => response.status(200).json(courses))
      .catch(() => response.status(500).end());
  }
);

/*** API USERS ***/

// PUT /api/students/:id
app.put(
  "/api/students/:id",
  [
    body("partime").isBoolean(),
    body("studyplan").isBoolean(),
    param("id").isInt({ min: 0 }),
  ],
  isLoggedIn,
  (request, response) => {
    if (!validationResult(request).isEmpty()) return res.status(422).end();
    studentsDao
      .updateStudentInfo(
        request.params.id,
        request.body.partime,
        request.body.studyplan
      )
      .then(() => response.status(204).end())
      .catch(() => response.status(500).end());
  }
);

// activate the server
app.listen(port, () =>
  console.log(`Server started at http://localhost:${port}.`)
);
