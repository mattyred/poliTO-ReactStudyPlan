import "bootstrap-icons/font/bootstrap-icons.css";
import { Row, Col, Spinner } from "react-bootstrap";
import { FullCoursesTable } from "../Components/FullCoursesTable";
import { NavigationBar } from "../Components/NavigationBar";
import { ButtonManageStudyPlan } from "../Components/ButtonManageStudyPlan";

const HomePage = (props) => {
  return (
    <>
      <NavigationBar authentication={props.authentication} />
      <Row>
        <Col md={12} bg="light" className="homepage-title">
          University Courses
        </Col>
      </Row>
      <Row>
        <ButtonManageStudyPlan />
      </Row>
      <Row>
        <Col md={12} bg="light" className="below-title">
          {props.isLoadingCourses ? (
            <Spinner animation="border" className="spinner"/>
          ) : (
            <FullCoursesTable
              courses={props.courses}
              coursesStudyPlan={props.coursesStudyPlan}
              checkCompatibility={props.checkCompatibility}
              getAllIncompatibleCourses={props.getAllIncompatibleCourses}
              getCourseByCode={props.getCourseByCode}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export { HomePage };
