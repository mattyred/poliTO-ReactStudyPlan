import "bootstrap-icons/font/bootstrap-icons.css";
import { Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { AccordionBox } from "./AccordionBox";
import { AddCourseButton } from "./AddCourseButton";

const FullCoursesTable = (props) => {
  const currentRoute = useLocation();
  const editStudyPlanRoute = "/studyPlan/edit";
  const studyPlanRoute = "/studyPlan";
  const inStudyPlanRoute =
    currentRoute.pathname === editStudyPlanRoute ||
    currentRoute.pathname === studyPlanRoute;
  const inEditStudyPlanRoute = currentRoute.pathname === editStudyPlanRoute;
  return (
    <Table bordered hover size="sm">
      <thead>
        <tr className="text-center">
          <th>Code</th>
          <th>Name</th>
          <th className="smallcol">Credits</th>
          <th className="smallcol">Max Students</th>
          <th className="smallcol">Enrolled Students</th>
          <th className="col-accordion" style={{ width: "30%" }}>
            Course Information
          </th>
          {inEditStudyPlanRoute ? (
            <th className="display-block">Action</th> // col to be added only in /edit mode
          ) : (
            ""
          )}
        </tr>
      </thead>
      <tbody>
        {props.courses.map((course) => (
          <CourseTableRow
            course={course}
            key={course.code}
            inStudyPlanRoute={inStudyPlanRoute}
            inEditStudyPlanRoute={inEditStudyPlanRoute}
            {...props}
          />
        ))}
      </tbody>
    </Table>
  );
};

const CourseTableRow = (props) => {
  let course = props.course;
  let rowClassName = undefined;
  if (props.inEditStudyPlanRoute) {
    if (
      props.course.maxStudents != null &&
      props.course.enrolledStudents === props.course.maxStudents
    )
      rowClassName = "fullcourse-row";
    else if (props.isPresentInStudyPlan(course.code))
      rowClassName = "notavailable-row";
    else if (
      !props.checkCompatibility(course.code) ||
      (props.course.preparatoryCourse != null &&
        !props.checkCompatibility(props.course.preparatoryCourse))
    )
      rowClassName = "incompatible-row";
  }
  return (
    <tr className={rowClassName}>
      <td>{course.code}</td>
      <td>{course.name}</td>
      <td className="text-center">{course.credits}</td>
      <td className="text-center">{course.maxStudents}</td>
      <td className="text-center">{course.enrolledStudents}</td>
      <td>
        <AccordionBox {...props} />
      </td>
      {props.inEditStudyPlanRoute ? <AddCourseButton {...props} /> : ""}
    </tr>
  );
};

export { FullCoursesTable };
