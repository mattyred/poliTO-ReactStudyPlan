import { Course } from "../Models/Course";
const SERVER_URL = "http://localhost:3001";

const addStudyPlan = async (id, studyPlan, partime) => {
    // add each course to the table STUDYPLAN
    const response = await fetch(SERVER_URL + `/api/studyplans/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({courses: studyPlan.map(course => course.code), partime: partime}),
    });
    if (!response.ok) return null;
};

const deleteStudyPlan = async (id) => {
  const response = await fetch(SERVER_URL + `/api/studyplans/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (response.ok) return null;
};

const getStudentStudyPlan = async (id) => {
  const response = await fetch(SERVER_URL + `/api/studyplans/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const coursesJson = await response.json();
  if (response.ok) {
    return coursesJson.map(
      (course) =>
        new Course(
          course.code,
          course.name,
          course.credits,
          course.maxStudents,
          course.enrolledStudents,
          course.preparatoryCourse
        )
    );
  } else throw coursesJson;
};
const APIStudyplans = { deleteStudyPlan, addStudyPlan, getStudentStudyPlan };
export default APIStudyplans;
