import { Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
const EditDeleteButtons = (props) => {
  return (
    <Row className="save-studyplan-buttons">
      <Col md={6}>
        <Link to="/studyPlan/edit">
          <Button variant="outline-info" className="w-100">
            Edit
          </Button>
        </Link>
      </Col>
      <Col md={6}>
        <ModalDeleteButton deleteStudyPlan={props.deleteStudyPlan} />
      </Col>
    </Row>
  );
};

const ModalDeleteButton = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="outline-danger" className="w-100" onClick={handleShow}>
        Delete
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          Confirm that you want to permanently delete your studyplan?
        </Modal.Body>
        <Modal.Footer>
          <Row className="w-100">
            <Col md={6}>
              <Link to="/studyPlan">
                <Button
                  variant="danger"
                  onClick={() => {
                    props.deleteStudyPlan();
                    handleClose();
                  }}
                  className="w-100"
                >
                  Yes, delete
                </Button>
              </Link>
            </Col>
            <Col md={6}>
              <Button variant="info" onClick={handleClose} className="w-100">
                No, keep it
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { EditDeleteButtons };
