"use strict";

const { db } = require('../Database/db');
const crypto = require('crypto');
const {Student}  = require("../Models/Student");

exports.getStudent = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM STUDENTS WHERE EMAIL = ?';
    db.get(sql, [email], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const student = new Student(row.ID, row.EMAIL, row.PARTIME, row.STUDYPLAN);
        crypto.scrypt(password, row.PASSWORDSALT, 32, function(err, hashedPassword) {
          if (err) reject(err);
          if(!crypto.timingSafeEqual(Buffer.from(row.PASSWORDHASH, 'hex'), hashedPassword))
            resolve(false);
          else{
            resolve(student);
          }
        });
      }
    });
  });
};

exports.updateStudentInfo = (id, partime, studyplan) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE STUDENTS SET PARTIME = ?, STUDYPLAN = ? WHERE ID = ?';
    db.all(sql, [partime, studyplan, id], (err) => {
      if (err) { 
        reject(err); 
      }
      else {
        resolve(true);
      }
    });
  });
};

