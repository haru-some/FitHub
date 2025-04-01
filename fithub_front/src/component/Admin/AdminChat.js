import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useNavigate } from "react-router-dom";

const AdminChat = () => {
  const navigate = useNavigate();
  return (
    <section className="chat-section">
      <div className="page-title">문의 관리</div>
      <div className="admin-chat-box">
        <div className="chat-member-list">
          <AdminChatList />
        </div>
        <div className="chat-box-view">
          <AdminChatView />
        </div>
      </div>
    </section>
  );
};

const AdminChatList = () => {
  return (
    <div className="admin-chat-list">
      <div className="admin-chat-room">
        <div className="chat-member-profile">
          <img src="/image/default_img.png" />
        </div>
        <div className="chat-member-main">
          <div className="chat-member-type">
            <div>회원 아이디</div>
          </div>
          <div className="chat-member-content">
            <div>마지막 문의 내용</div>
          </div>
        </div>
        <div className="chat-member-alarm">
          <NotificationsActiveIcon />
        </div>
      </div>
      <div className="admin-chat-room">
        <div className="chat-member-profile">
          <img src="/image/default_img.png" />
        </div>
        <div className="chat-member-main">
          <div className="chat-member-type">
            <div>회원 아이디</div>
          </div>
          <div className="chat-member-content">
            <div>마지막 문의 내용</div>
          </div>
        </div>
        <div className="chat-member-alarm">
          <NotificationsActiveIcon />
        </div>
      </div>
      <div className="admin-chat-room">
        <div className="chat-member-profile">
          <img src="/image/default_img.png" />
        </div>
        <div className="chat-member-main">
          <div className="chat-member-type">
            <div>회원 아이디</div>
          </div>
          <div className="chat-member-content">
            <div>마지막 문의 내용</div>
          </div>
        </div>
        <div className="chat-member-alarm">
          <NotificationsActiveIcon />
        </div>
      </div>
      <div className="admin-chat-room">
        <div className="chat-member-profile">
          <img src="/image/default_img.png" />
        </div>
        <div className="chat-member-main">
          <div className="chat-member-type">
            <div>회원 아이디</div>
          </div>
          <div className="chat-member-content">
            <div>마지막 문의 내용</div>
          </div>
        </div>
        <div className="chat-member-alarm">
          <NotificationsActiveIcon />
        </div>
      </div>
      <div className="admin-chat-room">
        <div className="chat-member-profile">
          <img src="/image/default_img.png" />
        </div>
        <div className="chat-member-main">
          <div className="chat-member-type">
            <div>회원 아이디</div>
          </div>
          <div className="chat-member-content">
            <div>마지막 문의 내용</div>
          </div>
        </div>
        <div className="chat-member-alarm">
          <NotificationsActiveIcon />
        </div>
      </div>
      <div className="admin-chat-room">
        <div className="chat-member-profile">
          <img src="/image/default_img.png" />
        </div>
        <div className="chat-member-main">
          <div className="chat-member-type">
            <div>회원 아이디</div>
          </div>
          <div className="chat-member-content">
            <div>마지막 문의 내용</div>
          </div>
        </div>
        <div className="chat-member-alarm">
          <NotificationsActiveIcon />
        </div>
      </div>
      <div className="admin-chat-room">
        <div className="chat-member-profile">
          <img src="/image/default_img.png" />
        </div>
        <div className="chat-member-main">
          <div className="chat-member-type">
            <div>회원 아이디</div>
          </div>
          <div className="chat-member-content">
            <div>마지막 문의 내용</div>
          </div>
        </div>
        <div className="chat-member-alarm">
          <NotificationsActiveIcon />
        </div>
      </div>
      <div className="admin-chat-room">
        <div className="chat-member-profile">
          <img src="/image/default_img.png" />
        </div>
        <div className="chat-member-main">
          <div className="chat-member-type">
            <div>회원 아이디</div>
          </div>
          <div className="chat-member-content">
            <div>마지막 문의 내용</div>
          </div>
        </div>
        <div className="chat-member-alarm">
          <NotificationsActiveIcon />
        </div>
      </div>
    </div>
  );
};

const AdminChatView = () => {
  return (
    <>
      <div className="member-chat-list">
        <div className="member-chat-room">
          <div className="chat-member-profile">
            <img src="/image/default_img.png" />
          </div>
          <div className="chat-member-main">
            <div className="chat-member-id">
              <div>대충 킹조지</div>
            </div>
            <div className="chat-member-content">
              <div>
                킹조지가 열변을 토하는 중
                <span className="chat-alarm">(봤는지 안봤는지 숫자)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="member-input">
        <input type="text" className="chat-input" />
        <button type="button">전송</button>
      </div>
    </>
  );
};

export default AdminChat;
