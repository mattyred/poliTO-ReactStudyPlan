import "bootstrap-icons/font/bootstrap-icons.css";
import { Navbar, Nav, Offcanvas, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NavigationBar = (props) => {
  const navigate = useNavigate();
  return (
    <Navbar
      bg="warning"
      expand="sm"
      variant="light"
      fixed="top"
      className="navbar-padding"
    >
      <Navbar.Brand>
        <Button className="button-homepage" onClick={() => {
          navigate("/");
          props.authentication.loggedIn && props.authentication.logout();
          }}>
          <i className="bi bi-mortarboard-fill icon-size" />
        </Button>
      </Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Nav>
          <UserButtonCanvas
            key={0}
            placement={"end"}
            name={"end"}
            authentication={props.authentication}
          />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

function UserButtonCanvas({ name, ...props }) {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <Button
        onClick={() => {
          props.authentication.loggedIn ? setShow(true) : navigate("/login");
        }}
        className="user-button"
      >
        {<i className="bi bi-person-circle icon-size" />}
      </Button>
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        {...props}
        className="offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Student Information</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Row>
            <Col>
              <strong>Username</strong>: {props.authentication.user.email}
            </Col>
          </Row>
          <Row>
            <Col>
              <strong>Study plan</strong>:{" "}
              {props.authentication.user.studyplan === 1 ? "yes" : "no"}
            </Col>
          </Row>
          {props.authentication.user.studyplan === 1 ? (
            <Row>
              <Col>
                <strong>Partime</strong>:{" "}
                {props.authentication.user.partime ? "yes" : "no"}
              </Col>
            </Row>
          ) : (
            ""
          )}

          <Row className="logout-button-row">
            <Col md={3} className="col align-self-center">
              <Button
                onClick={() => {
                  setShow(false);
                  props.authentication.logout();
                  navigate("/");
                }}
              >
                Logout
              </Button>
            </Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export { NavigationBar };
