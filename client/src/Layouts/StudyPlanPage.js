import "bootstrap-icons/font/bootstrap-icons.css";
import {
  Row,
  Col,
  DropdownButton,
  Dropdown,
  Card,
  Spinner,
} from "react-bootstrap";
import { FullCoursesTable } from "../Components/FullCoursesTable";
import { StudyPlanTable } from "../Components/StudyPlanTable";
import { NavigationBar } from "../Components/NavigationBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
const StudyPlanPage = (props) => {
  const navigate = useNavigate();
  
  // to handle page refresh inside /studyPlan route -> user is forced to login again
  useEffect(() => {
    if (!props.authentication.loggedIn) navigate("/login");
  }, [props.authentication.loggedIn]);

  return (
    <>
      <NavigationBar authentication={props.authentication} />
      <Row className="studyplan-courses-full">
        <Col md={8} bg="light">
          <h1 className="studyplan-titles">University Courses</h1>
          <FullCoursesTable {...props} />
        </Col>
        <Col md={4} bg="light">
          <h1 className="studyplan-titles">Study Plan</h1>
          <Outlet hasStudyPlan={props.hasStudyPlan} />{" "}
          {/*Either StudyPlanTableLayoyt or StudyPlanEmptyLayout*/}
        </Col>
      </Row>
    </>
  );
};

const StudyPlanTableLayoyt = (props) => {
  return <StudyPlanTable {...props} />;
};

const StudyPlanEmptyLayout = (props) => {
  const navigate = useNavigate();
  return (
    <Card className="card-studyplan-option">
      <Card.Body>
        <Card.Text className="card-studyplan-option-text">
          ...It seems you don't have a study plan...
        </Card.Text>
        <DropdownButton
          align="end"
          variant="success"
          title="Create Study Plan"
          id="dropdown-menu-align-end"
        >
          <Dropdown.Item
            eventKey="1"
            onClick={() => {
              props.setPartime(true);
              props.setLimitCredits(true);
              navigate("/studyPlan/edit");
            }}
          >
            Part Time
          </Dropdown.Item>
          <Dropdown.Item
            eventKey="2"
            onClick={() => {
              props.setPartime(false);
              props.setLimitCredits(false);
              navigate("/studyPlan/edit");
            }}
          >
            Full Time
          </Dropdown.Item>
        </DropdownButton>
      </Card.Body>
    </Card>
  );
};
export { StudyPlanPage, StudyPlanEmptyLayout, StudyPlanTableLayoyt };
