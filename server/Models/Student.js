"use strict";
/**
 * Constructor function for new Student objects
 * @param {string} email 
 * @param {boolean} parime 
 * @param {boolean} studyplan 
 */
function Student (id, email, partime, studyplan) {
    this.id = id;
    this.email = email;
    this.partime = partime;
    this.studyplan = studyplan;
}

exports.Student = Student;