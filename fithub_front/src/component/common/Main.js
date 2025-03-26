import { Link } from "react-router-dom";

const Main = () => {
  return (
    <div>
      <h1>메인페이지</h1>
      <Link to="/myfit">My Fit</Link>
      <Link to="/admin">Admin</Link>
    </div>
  );
};

export default Main;
