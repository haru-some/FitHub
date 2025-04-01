import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const AdminChat = () => {
  return (
    <section className="chat-section">
      <div className="page-title">문의 관리</div>
      <div className="admin-chat-box">
        <div className="admin-chat-list">
          <div className="admin-chat-room">
            <div className="chat-member-profile">
              <img src="/image/default_img.png" />
            </div>
            <div className="chat-member-main">
              <div className="chat-member-type">
                <div>문의 종류</div>
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
        <div className="admin-stat-button">
          <button type="button">미완료 문의</button>
          <button type="button">완료된 문의</button>
        </div>
      </div>
    </section>
  );
};

export default AdminChat;
