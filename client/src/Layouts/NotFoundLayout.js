import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFoundLayout() {
  return (
    <>
      <h2>This url doesn't exist!</h2>
      <Link to="/">
        <Button variant="info">
          <i className="bi bi-mortarboard-fill icon-size" /> &nbsp; Go to the
          homepage
        </Button>
      </Link>
    </>
  );
}

export { NotFoundLayout };
