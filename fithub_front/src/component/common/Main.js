import { Link } from "react-router-dom";

const Main = () => {
  return (
    <div>
      <Link to="/myfit">My Fit</Link>
      <hr></hr>
      <Link to="/admin/today">Admin</Link>
      <hr></hr>
      <Link to="/shop">Shopping</Link>
    </div>
  );
};

export default Main;
