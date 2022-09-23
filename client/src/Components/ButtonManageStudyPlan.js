import {Link} from "react-router-dom";
import {Button, Col } from "react-bootstrap";

const ButtonManageStudyPlan = () => {
  return (
    <Link to={"/login"}>
      <Col md={3}>
        <Button className="button-below-table" variant="info">
          <i className="bi bi-folder-symlink"></i>
          &nbsp;| Manage Study Plan
        </Button>
      </Col>
    </Link>
  );
};

export { ButtonManageStudyPlan };
