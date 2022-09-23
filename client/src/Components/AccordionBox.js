import {
    Accordion,
    Card,
    useAccordionButton,
    Button,
  } from "react-bootstrap";
import {useState} from "react";

const CustomToggle = ({
    children,
    eventKey,
    isShowingInfo,
    setIsShowingInfo,
    icon,
    setIsShowingInfoIcon,
  }) => {
    const handleClick = useAccordionButton(eventKey, () => {
      setIsShowingInfoIcon(icon);
      setIsShowingInfo(!isShowingInfo);
    });
  
    return (
      <Button type="button" variant="info" onClick={handleClick}>
        {children}
      </Button>
    );
};

const AccordionBox = (props) => {
    const iconArrowDown = <i className="bi bi-chevron-down"></i>;
    const iconArrowUp = <i className="bi bi-chevron-up"></i>;
    const [isShowingInfo, setIsShowingInfo] = useState(false);
    const [isShowingInfoIcon, setIsShowingInfoIcon] = useState(iconArrowDown);
    return(
        <Accordion defaultActiveKey={["0"]}>
          <Card>
            <Card.Header className="table-accordion-card-header">
              <CustomToggle
                eventKey="1"
                isShowingInfo={isShowingInfo}
                setIsShowingInfo={setIsShowingInfo}
                icon={!isShowingInfo ? iconArrowUp : iconArrowDown} // icon toggled
                setIsShowingInfoIcon={setIsShowingInfoIcon}
              >
                {isShowingInfoIcon}
              </CustomToggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>{<AccordionMessage {...props} />}</Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
    )
}
const AccordionMessage = (props) => {
    const preparatoryCourse =
      props.course.preparatoryCourse != null
        ? props.getCourseByCode(props.course.preparatoryCourse)
        : undefined;
    const notCompatiblesCourses = props.getAllIncompatibleCourses(
      props.course.code
    );
    return (
      <>
        {
          <small>
            <strong>Preparatory course:</strong> <br />
            {preparatoryCourse !== undefined ? (
              <ul>
                <li>{`${preparatoryCourse.code} - ${preparatoryCourse.name}`}</li>
              </ul>
            ) : (
              <i>No preparatory course</i>
            )}
            <hr />
            <strong>Incompatible courses:</strong> <br />
            {notCompatiblesCourses.length > 0 ? (
              <AccordionIncompatibleCoursesList courses={notCompatiblesCourses} />
            ) : (
              <i>No incompatible courses</i>
            )}
          </small>
        }
      </>
    );
  };
  
  const AccordionIncompatibleCoursesList = (props) => {
    return (
      <ul>
        {props.courses.map((course) => (
          <li key={course.code}>{`${course.code} - ${course.name}`}</li>
        ))}
      </ul>
    );
  };

  export {AccordionBox};