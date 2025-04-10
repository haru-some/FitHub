import { Link } from "react-router-dom";
import MarkUnreadChatAltIcon from "@mui/icons-material/MarkUnreadChatAlt";
import IntroSlider from "./IntroSlider";

const Main = () => {
  return (
    <div className="main-wrap">
      <Link to="/myfit">My Fit</Link>
      <hr></hr>
      <Link to="/community/list">community</Link>
      <hr></hr>
      <Link to="/admin/*">Admin</Link>
      <hr></hr>
      <Link to="/shop">Shopping</Link>
      <hr></hr>
      <Link to="/chat">
        <MarkUnreadChatAltIcon style={{ color: "#589c5f" }} />
      </Link>
      <IntroSlider />
    </div>
  );
};

export default Main;
