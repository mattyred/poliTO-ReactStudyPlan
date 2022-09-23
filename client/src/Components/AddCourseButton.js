import { Button, OverlayTrigger, Popover, Row, Col } from "react-bootstrap";

const AddCourseButton = (props) => {
  const compatible = props.checkCompatibility(props.course.code);
  const inLocalStudyPlan = props.isPresentInStudyPlan(props.course.code);
  const hasPreparatory =
    props.course.preparatoryCourse !== null &&
    !props.isPresentInStudyPlan(props.course.preparatoryCourse)
      ? true
      : false;
  const hasReachedMax =
    props.course.maxStudents != null
      ? props.course.enrolledStudents + 1 > props.course.maxStudents
      : false;
  const preparatoryIncompatible =
    hasPreparatory && !props.checkCompatibility(props.course.preparatoryCourse);

  if (hasReachedMax) {
    return <AddCourseButtonOverlay {...props} overlayType={"full"} />;
  } else if (!compatible) {
    // row of a incompatible course
    return <AddCourseButtonOverlay {...props} overlayType={"incompatible"} />;
  } else if (inLocalStudyPlan) {
    // if no incompatible it could also be: maxstudents==enrolledstudents or already added to the studyplan
    return <AddCourseButtonOverlay {...props} overlayType={"not-available"} />;
  } else if (preparatoryIncompatible) {
    return (
      <AddCourseButtonOverlay
        {...props}
        overlayType={"preparatory-incompatible"}
      />
    );
  } else if (hasPreparatory) {
    return <AddCourseButtonOverlay {...props} overlayType={"preparatory"} />;
  } else {
    return <AddCourseButtonNoOverlay {...props} />;
  }
};

const AddCourseButtonNoOverlay = (props) => {
  return (
    <td align="center">
      <Button
        variant="info"
        onClick={() => props.addCourseStudyPlan(props.course)}
      >
        <i className="bi bi-folder-plus"></i>
      </Button>
    </td>
  );
};

const AddCourseButtonOverlay = (props) => {
  let messageBody, icon;
  switch (props.overlayType) {
    case "incompatible":
      messageBody = (
        <>
          Not compatible with this course/s in your study plan:
          <ul>
            {props
              .getCoursesIncompatibleWithStudyPlan(props.course.code)
              .map((course) => (
                <li key={course.code}>
                  {
                    <>
                      <strong>{`${course.code}  - ${course.name}`}</strong>
                    </>
                  }
                </li>
              ))}
          </ul>
        </>
      );
      icon = "bi bi-folder-x";
      break;
    case "preparatory":
      messageBody = (
        <>
          This course has also a preparatory course: <br />
          <strong>
            {props.course.preparatoryCourse +
              "-" +
              props.getCourseByCode(props.course.preparatoryCourse).name}
          </strong>
          <br />
          <AddBothMessage {...props} />
        </>
      );
      icon = "bi bi-folder-plus";
      break;
    case "preparatory-incompatible":
      messageBody = (
        <>
          This course has also a preparatory course: <br />
          <strong>
            {props.course.preparatoryCourse +
              " - " +
              props.getCourseByCode(props.course.preparatoryCourse).name}
          </strong>
          <br />
          that it is not compatible with your current study plan.
        </>
      );
      icon = "bi bi-folder-x";
      break;
    case "not-available":
      messageBody = <>You already have this course in your study plan!</>;
      icon = "bi bi-folder-check";
      break;
    case "full":
      messageBody = (
        <>
          This course has already reached the maximum number of students
          allowed!
        </>
      );
      icon = "bi bi-folder-x";
      break;
    default:
      break;
  }
  return (
    <td align="center">
      <OverlayTrigger
        trigger={
          props.overlayType === "preparatory" ? "click" : ["hover", "focus"]
        }
        placement="top"
        rootClose
        overlay={
          <Popover id="popover-basic">
            <Popover.Body>{messageBody}</Popover.Body>
          </Popover>
        }
      >
        <Button
          variant={props.overlayType === "preparatory" ? "info" : "secondary"}
        >
          <i
            className={icon}
          ></i>
        </Button>
      </OverlayTrigger>
    </td>
  );
};

const AddBothMessage = (props) => {
  const preparatoryCourse = props.getCourseByCode(
    props.course.preparatoryCourse
  );
  return (
    <>
      Do you want to add them both?
      <Row>
        <Col md={6}>
          {" "}
          <Button
            variant="success"
            onClick={() => {
              props.addRelatedCoursesStudyPlan(props.course, preparatoryCourse);
              //props.addCourseStudyPlan(props.course.preparatoryCourse); i need the object course
              document.body.click();
            }}
          >
            Add Both
          </Button>
        </Col>
        <Col md={6}>
          <Button
            variant="danger"
            onClick={() => {
              document.body.click();
            }}
          >
            Don't Add
          </Button>
        </Col>
      </Row>
    </>
  );
};

export { AddCourseButton };
