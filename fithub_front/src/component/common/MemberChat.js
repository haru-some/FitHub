import "./chat.css";

const MemberChat = () => {
  return (
    <section className="chat-section">
      <div className="page-title">(대충 누구님의) 문의 목록</div>
      <div className="member-chat-box">
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
      </div>
    </section>
  );
};

export default MemberChat;
