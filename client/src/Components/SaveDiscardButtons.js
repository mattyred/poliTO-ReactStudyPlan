import { useNavigate, Link } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  OverlayTrigger,
  Popover,
  Modal,
} from "react-bootstrap";
import { useState } from "react";

const SaveDiscardButtons = (props) => {
  const navigate = useNavigate();
  const underCreditsThreshold = props.credits.current < props.credits.min;
  const overCreditsThreshold = props.credits.current > props.credits.max;
  return (
    <Row className="save-studyplan-buttons">
      <Col md={6}>
        {underCreditsThreshold || overCreditsThreshold ? (
          <SaveButtonDisabled credits={props.credits} />
        ) : (
          <SaveButtonEnabled saveLocalStudyPlan={props.saveLocalStudyPlan} />
        )}
      </Col>
      <Col md={6}>
        <Button
          variant="outline-danger"
          className="w-100"
          onClick={() => {
            props.hasStudyPlan
              ? props.getStudentStudyPlan()
              : props.setCoursesStudyPlan([]);
            navigate("/studyPlan/");
          }}
        >
          Discard
        </Button>
      </Col>
    </Row>
  );
};

const SaveButtonDisabled = (props) => {
  const creditsBelowMin = props.credits.min - props.credits.current;
  const creditsAboveMax = props.credits.current - props.credits.max;
  const belowMin = creditsBelowMin > 0;
  return (
    <OverlayTrigger
      trigger={["hover", "focus"]}
      placement="bottom"
      rootClose
      overlay={
        <Popover id="popover-basic">
          <Popover.Body>
            {belowMin
              ? `You still have to insert at least ${creditsBelowMin} credit/s`
              : `You are ${creditsAboveMax} credit/s over maximum allowed!`}
          </Popover.Body>
        </Popover>
      }
    >
      <Button variant="outline-secondary" className="w-100">
        {" "}
        Save{" "}
      </Button>
    </OverlayTrigger>
  );
};

const SaveButtonEnabled = (props) => {
  return <ModalSaveButton saveLocalStudyPlan={props.saveLocalStudyPlan} />;
};

const ModalSaveButton = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="outline-success" className="w-100" onClick={handleShow}>
        Save
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          Confirm that you want to permanently save your study plan?
          <br />
          <small>
            <i>*This action will delete any previuosly saved study plan</i>
          </small>
        </Modal.Body>
        <Modal.Footer>
          <Row className="w-100">
            <Col md={6}>
              <Link to="/studyPlan">
                <Button
                  variant="success"
                  onClick={() => {
                    props.saveLocalStudyPlan();
                    handleClose();
                  }}
                  className="w-100"
                >
                  Yes, save
                </Button>
              </Link>
            </Col>
            <Col md={6}>
              <Button
                variant="secondary"
                onClick={handleClose}
                className="w-100"
              >
                No, don't save
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export { SaveDiscardButtons };
