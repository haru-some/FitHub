import { Link } from "react-router-dom";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";

const Main = () => {
  return (
    <div>
      <Link to="/myfit">My Fit</Link>
      <Link to="/community/list">community</Link>
      <hr></hr>
      <Link to="/admin/*">Admin</Link>
      <hr></hr>
      <Link to="/shop">Shopping</Link>
      <hr></hr>
      <Link to="/chat">
        <MarkUnreadChatAltIcon style={{ color: "#589c5f" }} />
      </Link>
    </div>
  );
};

export default Main;
