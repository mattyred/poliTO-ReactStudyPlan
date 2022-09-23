import "bootstrap-icons/font/bootstrap-icons.css";
import {
  Table,
  Row,
  Col,
  Button,
  OverlayTrigger,
  Popover
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SaveDiscardButtons } from "../Components/SaveDiscardButtons";
import { EditDeleteButtons } from "../Components/EditDeleteButtons";

const StudyPlanTable = (props) => {
  const route = useLocation();
  const [isInEditStudyPlanRoute, setIsInEditStudyPlanRoute] = useState(false);
  useEffect(() => {
    if (route.pathname === "/studyPlan/edit") {
      setIsInEditStudyPlanRoute(true);
    } else setIsInEditStudyPlanRoute(false);
  }, [route]);
  return (
    <>
      <Table striped bordered hover size="sm">
        <thead>
          <tr className="text-center">
            <th>Code</th>
            <th>Name</th>
            <th>Credits</th>
            {isInEditStudyPlanRoute && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {props.coursesStudyPlan.map((course) => (
            <CourseTableRow
              course={course}
              key={course.code}
              removeCourseStudyPlan={props.removeCourseStudyPlan}
              studyPlanExisting={props.studyPlanExisting}
              isInEditStudyPlanRoute={isInEditStudyPlanRoute}
              checkIsViolatingPreparatoryConstraint={
                props.checkIsViolatingPreparatoryConstraint
              }
              removeRelatedCoursesStudyPlan={
                props.removeRelatedCoursesStudyPlan
              }
            />
          ))}
        </tbody>
      </Table>
      <hr />
      <Row>
        <small>
          <strong>Inserted Credits:</strong>
          &nbsp;{props.credits.current}
          <hr />
        </small>
        <small>
          <strong>Option:</strong>
          &nbsp;{props.partime ? "Partime" : "Full Time"}
        </small>
        <small>
          <strong>Min Credits:</strong>
          &nbsp;{props.credits.min}
        </small>
        <small>
          <strong>Max Credits:</strong>
          &nbsp;{props.credits.max}
        </small>
      </Row>
      {isInEditStudyPlanRoute ? (
        <SaveDiscardButtons
          saveLocalStudyPlan={props.saveLocalStudyPlan}
          setCoursesStudyPlan={props.setCoursesStudyPlan}
          hasStudyPlan={props.hasStudyPlan}
          getStudentStudyPlan={props.getStudentStudyPlan}
          credits={props.credits}
        />
      ) : (
        <EditDeleteButtons deleteStudyPlan={props.deleteStudyPlan} />
      )}
    </>
  );
};

const CourseTableRow = (props) => {
  let course = props.course;
  let coursePreparatory = props.checkIsViolatingPreparatoryConstraint(course); // check if this course is preparatory for another one
  return (
    <tr>
      <td>{course.code}</td>
      <td>{course.name}</td>
      <td className="text-center">{course.credits}</td>
      {props.isInEditStudyPlanRoute && (
        <td className="text-center">
          {coursePreparatory !== undefined ? (
            <DeleteButtonOverlayPreparatory
              coursePreparatory={coursePreparatory}
              removeRelatedCoursesStudyPlan={
                props.removeRelatedCoursesStudyPlan
              }
              course={course}
            />
          ) : (
            <DeleteButtonNoOverlay
              course={course}
              removeCourseStudyPlan={props.removeCourseStudyPlan}
            />
          )}
        </td>
      )}
    </tr>
  );
};

const DeleteButtonNoOverlay = (props) => {
  return (
    <Button
      variant="outline-danger"
      onClick={() => {
        props.removeCourseStudyPlan(props.course);
      }}
    >
      <i className="bi bi-folder-minus"></i>
    </Button>
  );
};

const DeleteButtonOverlayPreparatory = (props) => {
  return (
    <>
      <OverlayTrigger
        trigger="click"
        placement="left"
        rootClose
        overlay={
          <Popover id="popover-basic">
            <Popover.Body>
              This course is mandatory for: <br />
              <strong>
                {props.coursePreparatory.code +
                  " - " +
                  props.coursePreparatory.name}
              </strong>
              <br />
              {
                <RemoveBothMessage
                  course={props.course}
                  removeRelatedCoursesStudyPlan={
                    props.removeRelatedCoursesStudyPlan
                  }
                  coursePreparatory={props.coursePreparatory}
                />
              }
            </Popover.Body>
          </Popover>
        }
      >
        <Button variant="outline-danger">
          <i className="bi bi-folder-minus"></i>
        </Button>
      </OverlayTrigger>
    </>
  );
};

const RemoveBothMessage = (props) => {
  return (
    <>
      Do you want to remove them both?
      <Row>
        <Col md={6} className="text-center">
          <Button
            variant="success"
            onClick={() => {
              props.removeRelatedCoursesStudyPlan(
                props.course,
                props.coursePreparatory
              );
              document.body.click();
            }}
          >
            <small>Yes</small>
          </Button>
        </Col>
        <Col md={6} className="text-center">
          <Button
            variant="danger"
            onClick={() => {
              document.body.click();
            }}
          >
            <small>No</small>
          </Button>
        </Col>
      </Row>
    </>
  );
};

export { StudyPlanTable };
