import "bootstrap/dist/css/bootstrap.min.css";
import { HomePage } from "./Layouts/HomePage";
import {
  StudyPlanPage,
  StudyPlanEmptyLayout,
  StudyPlanTableLayoyt,
} from "./Layouts/StudyPlanPage";
import {NotFoundLayout} from "./Layouts/NotFoundLayout";
import { LoginForm } from "./Layouts/LoginForm";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import APICourses from "./API/API-Courses";
import APIStudents from "./API/API-Students";
import APIStudyplans from "./API/API-Studyplans";
import { Student } from "./Models/Student";
import "./App.css";

function App() {
  const [courses, setCourses] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedUser, setLoggedUser] = useState({});
  const [localStudyPlan, setLocalStudyPlan] = useState([]);
  const [incompatibleCourses, setIncompatibleCourses] = useState([]);
  const [partime, setPartime] = useState(false);
  const [credits, setCredits] = useState({});
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  // Retrieve the list of courses as not logged user
  useEffect(() => {
    getAllCourses();
    setIsLoadingCourses(false);
  }, []);

  // Setup the local study plan and partime setting when user is logged in
  useEffect(() => {
    if (loggedIn) {
      const user = loggedUser;
      setPartime(user.partime === 1 ? true : false);
      if (user.studyplan) {
        getStudentStudyPlan();
      }
    } else {
      // after logout
      setLocalStudyPlan([]);
      getAllCourses();
    }
  }, [loggedIn]);

  const setLimitCredits = (partime) => {
    const creditsInfo = {
      min: partime ? 20 : 60,
      max: partime ? 40 : 80,
      current: 0,
    };
    setCredits(creditsInfo);
  };

  // Get courses of study plan 
  const getStudentStudyPlan = async () => {
    const coursesStudyPlan = await APIStudyplans.getStudentStudyPlan(
      loggedUser.id
    );
    setLocalStudyPlan(coursesStudyPlan);
    const creditsInfo = {
      min: loggedUser.partime ? 20 : 60,
      max: loggedUser.partime ? 40 : 80,
      current: coursesStudyPlan
        .map((course) => course.credits)
        .reduce((c1, c2) => c1 + c2),
    };
    setCredits(creditsInfo);
  };

  // Get all courses in alphabetical order
  const alphabeticalSortOrder = (name1, name2) => {
    return name1.localeCompare(name2);
  };
  const getAllCourses = async () => {
    const courses = await APICourses.getAllCourses();
    const inc = await APICourses.getAllIncompatibles();
    setCourses(
      courses.sort((c1, c2) => alphabeticalSortOrder(c1.name, c2.name))
    );
    setIncompatibleCourses(inc);
  };

  // Refresh properties of courses when needed (enrolled students)
  const updateCourses = async () => {
    const courses = await APICourses.getAllCourses();
    setCourses(
      courses.sort((c1, c2) => alphabeticalSortOrder(c1.name, c2.name))
    );
  };

  // Logout
  const handleLogout = async () => {
    await APIStudents.logOut();
    setLoggedIn(false);
  };

  // Add/Remove course/s to local study plan
  const addCourseStudyPlan = (newCourse) => {
    setLocalStudyPlan([...localStudyPlan, newCourse]);
    const currentCredits = credits.current;
    setCredits({ ...credits, current: currentCredits + newCourse.credits });
  };

  const addRelatedCoursesStudyPlan = (newCourse1, newCourse2) => {
    setLocalStudyPlan([...localStudyPlan, newCourse1, newCourse2]);
    const currentCredits = credits.current;
    setCredits({
      ...credits,
      current: currentCredits + newCourse1.credits + newCourse2.credits,
    });
  };

  const removeRelatedCoursesStudyPlan = (course1, course2) => {
    setLocalStudyPlan([
      ...localStudyPlan.filter(
        (course) => course.code !== course1.code && course.code !== course2.code
      ),
    ]);
    const currentCredits = credits.current;
    setCredits({
      ...credits,
      current: currentCredits - course1.credits - course2.credits,
    });
  };

  const removeCourseStudyPlan = (courseToRemove) => {
    setLocalStudyPlan([
      ...localStudyPlan.filter((course) => course.code !== courseToRemove.code),
    ]);
    const currentCredits = credits.current;
    setCredits({
      ...credits,
      current: currentCredits - courseToRemove.credits,
    });
  };

  // Check if course is present in local study plan
  const isPresentInStudyPlan = (code) => {
    return localStudyPlan
      .map((course) => course.code)
      .some((courseCode) => courseCode === code);
  };

  // Get course given the code
  const getCourseByCode = (code) => {
    return courses.filter((course) => course.code === code)[0];
  };

  // Check if a course can be correctly removed from local study plan in edit mode
  const checkIsViolatingPreparatoryConstraint = (courseToRemove) => {
    // check if by removing this course a preparatory constraint is violated
    return localStudyPlan
      .filter((course) => course.preparatoryCourse !== null)
      .find((course) => course.preparatoryCourse === courseToRemove.code);
  };

  // Check compatibility constraint of a potential new course of local study plan
  const checkCompatibility = (newCourseCode) => {
    // Check if the course with code "newCourseCode" can be addded to the local study plan.
    // Linear search among incompatibleCourses that is an array of json {course_a, course_b}:
    // if newCourseCode is equal to course_a(or course_b) check if course_b(or course_a) is one
    // among the currently courses in the studyPlan
    for (let incompatibles of incompatibleCourses) {
      if (
        (incompatibles.course_a === newCourseCode &&
          isPresentInStudyPlan(incompatibles.course_b)) ||
        (incompatibles.course_b === newCourseCode &&
          isPresentInStudyPlan(incompatibles.course_a))
      )
        return false;
    }
    return true;
  };

  const getAllIncompatibleCourses = (courseCode) => {
    // Get all the incompatible courses of a given course

    return incompatibleCourses
      .filter(
        (courses) =>
          courses.course_a === courseCode || courses.course_b === courseCode
      )
      .map((courses) => {
        if (courses.course_a === courseCode)
          return getCourseByCode(courses.course_b);
        else return getCourseByCode(courses.course_a);
      });
  };

  const getCoursesIncompatibleWithStudyPlan = (courseCode) => {
    // Get all the incompatible courses of a given course

    return incompatibleCourses
      .filter(courses => isInLocalStudyPlan(courses.course_a) || isInLocalStudyPlan(courses.course_b))
      .filter(
        (courses) =>
          courses.course_a === courseCode || courses.course_b === courseCode
      )
      .map((courses) => {
        if (courses.course_a === courseCode)
          return getCourseByCode(courses.course_b);
        else return getCourseByCode(courses.course_a);
      });
  };

  // Save the local study plan
  const saveLocalStudyPlan = async () => {
    // If student has a studyplan delete it
    const id = loggedUser.id;
    if (loggedUser.studyplan) {
      const previousStudyPlan = await APIStudyplans.getStudentStudyPlan(id);
      await APIStudyplans.deleteStudyPlan(id);
      await APICourses.decrementEnrolledStudents(previousStudyPlan);
    }
    // add study plan to the db
    await APIStudyplans.addStudyPlan(id, localStudyPlan, partime);
    // increment the number of enrolled students
    await APICourses.incrementEnrolledStudents(localStudyPlan);
    // update user information about PARTIME and STUDYPLAN
    const modifiedStudent = new Student(
      loggedUser.id,
      loggedUser.email,
      partime,
      1
    );
    await APIStudents.updateStudentInfo(modifiedStudent);
    setLoggedUser(modifiedStudent);
    updateCourses();
  };

  const isInLocalStudyPlan = (courseCode) => {
    return localStudyPlan
      .map((course) => course.code)
      .some((code) => code === courseCode);
  };

  // Permanently delete a study plan
  const deleteStudyPlan = async () => {
    await APIStudyplans.deleteStudyPlan(loggedUser.id);
    const modifiedStudent = new Student(
      loggedUser.id,
      loggedUser.email,
      partime,
      0
    );
    await APIStudents.updateStudentInfo(modifiedStudent);
    await APICourses.decrementEnrolledStudents(localStudyPlan);
    updateCourses();
    setLocalStudyPlan([]);
    setLoggedUser(modifiedStudent);
  };

  return (
    <BrowserRouter>
      <Container fluid className="App">
        <Routes>
        <Route path="*" element={<NotFoundLayout />} />
          <Route path="/">
            <Route
              index
              element={
                <HomePage
                  // spinner state
                  isLoadingCourses={isLoadingCourses}
                  // courses utilities
                  courses={courses}
                  coursesStudyPlan={localStudyPlan}
                  checkCompatibility={checkCompatibility}
                  getAllIncompatibleCourses={getAllIncompatibleCourses}
                  getCourseByCode={getCourseByCode}
                  // logged user info
                  authentication={{
                    user: loggedUser,
                    loggedIn: loggedIn,
                    logout: handleLogout,
                  }}
                />
              }
            />
            <Route
              path="/login"
              element={
                !loggedIn ? (
                  <LoginForm
                    setLoggedIn={setLoggedIn}
                    setLoggedUser={setLoggedUser}
                  />
                ) : (
                  // When loggedIn is true change correctly the route
                  <Navigate replace to="/studyPlan" />
                )
              }
            />
            <Route
              path="/studyPlan"
              element={
                <StudyPlanPage
                  // courses utilities
                  courses={courses}
                  coursesStudyPlan={localStudyPlan}
                  addCourseStudyPlan={addCourseStudyPlan}
                  addRelatedCoursesStudyPlan={addRelatedCoursesStudyPlan}
                  getCourseByCode={getCourseByCode}
                  getAllIncompatibleCourses={getAllIncompatibleCourses}
                  checkCompatibility={checkCompatibility}
                  setCoursesStudyPlan={setLocalStudyPlan}
                  isPresentInStudyPlan={isPresentInStudyPlan}
                  getCoursesIncompatibleWithStudyPlan={getCoursesIncompatibleWithStudyPlan}
                  // logged user info
                  authentication={{
                    user: loggedUser,
                    loggedIn: loggedIn,
                    logout: handleLogout,
                  }}
                />
              }
            >
              <Route
                index
                element={
                  !loggedUser.studyplan ? (
                    <StudyPlanEmptyLayout
                      setPartime={setPartime}
                      hasStudyPlan={loggedUser.studyplan}
                      setCoursesStudyPlan={setLocalStudyPlan}
                      setLimitCredits={setLimitCredits}
                    />
                  ) : (
                    <StudyPlanTableLayoyt
                      credits={credits}
                      partime={partime}
                      // Studyplan utilities
                      hasStudyPlan={loggedUser.studyplan}
                      coursesStudyPlan={localStudyPlan}
                      setCoursesStudyPlan={setLocalStudyPlan}
                      removeCourseStudyPlan={removeCourseStudyPlan}
                      saveLocalStudyPlan={saveLocalStudyPlan}
                      checkIsViolatingPreparatoryConstraint={
                        checkIsViolatingPreparatoryConstraint
                      }
                      deleteStudyPlan={deleteStudyPlan}
                    />
                  )
                }
              />
              <Route
                path="/studyPlan/edit"
                element={
                  <StudyPlanTableLayoyt
                    credits={credits}
                    partime={partime}
                    // Studyplan utilities
                    hasStudyPlan={loggedUser.studyplan}
                    coursesStudyPlan={localStudyPlan}
                    setCoursesStudyPlan={setLocalStudyPlan}
                    removeCourseStudyPlan={removeCourseStudyPlan}
                    saveLocalStudyPlan={saveLocalStudyPlan}
                    checkIsViolatingPreparatoryConstraint={
                      checkIsViolatingPreparatoryConstraint
                    }
                    getStudentStudyPlan={getStudentStudyPlan}
                    removeRelatedCoursesStudyPlan={
                      removeRelatedCoursesStudyPlan
                    }
                    isInLocalStudyPlan={isInLocalStudyPlan}
                    getAllIncompatibleCourses={getAllIncompatibleCourses}
                    getCoursesIncompatibleWithStudyPlan={getCoursesIncompatibleWithStudyPlan}                  
                  />
                }
              />
            </Route>
          </Route>
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
