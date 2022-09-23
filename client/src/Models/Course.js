"use strict";
/**
 * Constructor function for new Course objects
 * @param {string} code 
 * @param {string} name 
 * @param {number} credits 
 * @param {number} maxStudents 
 * @param {string} preparatoryCourse 
 */
function Course (code, name, credits, maxStudents, enrolledStudents, preparatoryCourse) {
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.maxStudents = maxStudents;
    this.enrolledStudents = enrolledStudents;
    this.preparatoryCourse = preparatoryCourse;
}

exports.Course = Course;