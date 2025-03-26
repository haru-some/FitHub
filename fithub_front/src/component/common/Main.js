import { Link } from "react-router-dom";

const Main = () => {
  return (
    <div>
      <h1>메인페이지</h1>
      <Link to="/myfit">My Fit</Link>
      <br></br>
      <Link to="/community/list">community</Link>
    </div>
  );
};

export default Main;
