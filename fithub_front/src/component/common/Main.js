import { Link } from "react-router-dom";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";

const Main = () => {
  return (
    <div>
      <Link to="/myfit">My Fit</Link>
      <hr></hr>
      <Link to="/community/list">community</Link>
      <hr></hr>
      <Link to="/admin/*">Admin</Link>
      <hr></hr>
      <Link to="/shop">Shopping</Link>
      <hr></hr>
    </div>
  );
};

export default Main;
