"use strict";

const { db } = require("../Database/db");
const {Course}  = require("../Models/Course");

exports.deleteStudyPlan = (email) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM STUDYPLANS WHERE STUDENT = ?";
    db.all(sql, [email], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

exports.addStudyPlan = (id, course) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO STUDYPLANS(STUDENT, COURSE) VALUES(?,?)";
    db.all(sql, [id, course], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

exports.getStudyPlan = (id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM COURSES C, STUDYPLANS S WHERE C.CODE = S.COURSE AND S.STUDENT = ?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      } else {
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
