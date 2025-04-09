import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { refreshState } from "../utils/RecoilData";

const DmList = (props) => {
  const refresh = useRecoilValue(refreshState);
  const params = useParams();
  const memberNo = params.memberNo;
  const [dmList, setDmList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("data");
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/myfit/dm/${memberNo}`)
      .then((res) => {
        console.log(res.data);
        setDmList(res.data);
      })
      .catch((err) => {});
  }, [refresh]);
  console.log(refresh);

  return (
    <div className="myfit-dm-wrap">
      <ul className="user-list">
        {dmList.map((dm, index) => {
          return (
            <li
              key={"dm-" + index}
              className="user-item-wrap"
              onClick={() => {
                navigate(`/myfit/chat/${memberNo}/${dm.otherMemberNo}`);
              }}
            >
              <div
                className="user-item"
                onClick={() => {
                  //navigate(`/myfit/activity/${member.memberNo}`);
                }}
              >
                <div className="avatar-wrap">
                  <img
                    src={
                      dm.otherMemberThumb
                        ? `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${dm.otherMemberThumb}`
                        : "/image/default_img.png"
                    }
                    className="avatar"
                  />
                </div>
                <div className="user-info">
                  <div className="info-wrap">
                    <div className="name">{dm.otherMemberId}</div>
                    <div className="username">{dm.otherMemberName}</div>
                  </div>
                  <div className="bot-wrap">
                    <div className="dm-item-content">
                      {dm.lastMessageContent}
                    </div>
                    <div
                      className={`unread-count ${
                        dm.unreadCount !== 0 ? "unread" : ""
                      }`}
                    >
                      <span>{dm.unreadCount !== 0 ? dm.unreadCount : ""}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DmList;
