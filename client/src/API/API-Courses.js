import { Course } from "../Models/Course";
const SERVER_URL = "http://localhost:3001";

const getAllCourses = async () => {
  const response = await fetch(SERVER_URL + "/api/courses", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
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

const getAllIncompatibles = async () => {
  const response = await fetch(SERVER_URL + "/api/courses/incompatibles", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const coursesJson = await response.json();
  if (response.ok) {
    return coursesJson;
  } else throw coursesJson;
};

const incrementEnrolledStudents = async (studyPlan) => {
  for(let course of studyPlan){
    const response = await fetch(SERVER_URL + `/api/courses/${course.code}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({enroll: 1}),
    });
    if(!response.ok) return null;
  }
  return true;
}

const decrementEnrolledStudents = async (studyPlan) => {
  for(let course of studyPlan){
    const response = await fetch(SERVER_URL + `/api/courses/${course.code}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({enroll: 0})
    });
    if(!response.ok) return null;
  }
  return true;
}

const APICourses = { getAllCourses, getAllIncompatibles, incrementEnrolledStudents, decrementEnrolledStudents };
export default APICourses;
