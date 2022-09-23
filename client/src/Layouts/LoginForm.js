import { useState } from "react";
import { Form, Button, Col, Row, Alert } from "react-bootstrap";
import APIStudents from "../API/API-Students";

function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectCredentials, setIncorrectCredentials] = useState(false);

  const handleLogin = async (credentials) => {
    try {
      const user = await APIStudents.logIn(credentials);
      props.setLoggedIn(true);
      props.setLoggedUser(user);
    } catch (err) {
      setIncorrectCredentials(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    handleLogin(credentials);
  };

  return (
    <>
      <Row className="row justify-content-center">
        <Col md={3} className="login-form">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                required={true}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                required={true}
                minLength={6}
              />
            </Form.Group>

            <Button type="submit" className="login-form-button">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="row justify-content-center">
        <Col md={3} className="login-alert">
          {incorrectCredentials ? (
            <Alert
              variant={"danger"}
              onClose={() => setIncorrectCredentials(false)} 
              className="text-center"
            >
              {"Incorrect username and/or password"}
            </Alert>
          ) : (
            ""
          )}
        </Col>
      </Row>
    </>
  );
}

export { LoginForm };
