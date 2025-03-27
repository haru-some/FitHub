import { Link } from "react-router-dom";

const Main = () => {
  return (
    <div>
      <Link to="/myfit">My Fit</Link>
      <Link to="/community/list">community</Link>
      <hr></hr>
      <Link to="/admin/*">Admin</Link>
      <hr></hr>
      <Link to="/shop">Shopping</Link>
    </div>
  );
};

export default Main;
