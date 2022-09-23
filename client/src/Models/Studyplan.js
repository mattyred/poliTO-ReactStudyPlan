"use strict";
/**
 * Constructor function for new Studyplan objects
 * @param {User} user 
 * @param {boolean} studyplan 
 */
function Studyplan (user, partime) {
    this.user = user;
    this.partime = partime;
}

exports.Studyplan = Studyplan;