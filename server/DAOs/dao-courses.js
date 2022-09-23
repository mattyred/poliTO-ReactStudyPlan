"use strict";
const { db } = require("../Database/db");
const { Course } = require("../Models/Course");

exports.getListCourses = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM COURSES";
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else {
        const courses = rows.map(
          (row) =>
            new Course(
              row.CODE,
              row.NAME,
              row.CREDITS,
              row.MAXSTUDENTS,
              row.ENROLLEDSTUDENTS,
              row.PREPARATORYCOURSE
            )
        );
        resolve(courses);
      }
    });
  });
};

exports.getListIncompatibleCourses = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM INCOMPATIBLES";
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else {
        const courses = rows.map(
          (row) =>
            ({"course_a": row.COURSE_A, "course_b": row.COURSE_B})
        );
        resolve(courses);
      }
    });
  });
};

exports.incrementEnrolledStudents = (code) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE COURSES SET ENROLLEDSTUDENTS = ENROLLEDSTUDENTS + 1 WHERE CODE = ?";
    db.all(sql, [code], (err) => {
      if (err) reject(err);
      else {
        resolve(true);
      }
    });
  });
}

exports.decrementEnrolledStudents = (code) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE COURSES SET ENROLLEDSTUDENTS = ENROLLEDSTUDENTS - 1 WHERE CODE = ?";
    db.all(sql, [code], (err) => {
      if (err) reject(err);
      else {
        resolve(true);
      }
    });
  });
}
