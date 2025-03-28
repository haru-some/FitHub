import axios from "axios";
import { useEffect, useState } from "react";

const AdminMember = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [memberList, setMemberList] = useState([]);
  const [delMemberList, setDelMemberList] = useState();
  useEffect(() => {
    axios
      .get(`${backServer}/admin/member`)
      .then((res) => {
        setMemberList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <section className="admin-member-section">
      <div className="tab">
        <div className="page-title">회원 관리</div>
        <div className="page-title">게시글 관리</div>
      </div>
      <div className="member-tab">
        <MemberList memberList={memberList} setMemberList={setMemberList} />
      </div>
      <div className="board-tab"></div>
    </section>
  );
};

const MemberList = (props) => {
  const memberList = props.memberList;
  const setMemberList = props.setMemberList;

  const selectChange = (e, index) => {
    const { name, value } = e.target;

    const memberId = memberList[index].memberId; // 변경할 회원 ID

    // 1. 변경된 필드만 포함한 객체 생성
    const updateMember = Object.keys(memberList[index]).reduce((acc, key) => {
      acc[key] = key === name ? value : null;
      return acc;
    }, {});

    setMemberList((prevList) =>
      prevList.map((member, i) =>
        i === index ? { ...member, [name]: value } : member
      )
    );

    axios
      .patch(
        `${process.env.REACT_APP_BACK_SERVER}/admin/member/${memberId}`,
        updateMember
      )
      .then((res) => {
        console.log("업데이트 성공:", res.data);
      })
      .catch((err) => {
        console.error("업데이트 실패:", err);
      });
  };
  console.log(memberList);
  return (
    <div>
      <table className="admin-tbl">
        <thead className="admin-thead">
          <tr>
            <th>프로필</th>
            <th>아이디</th>
            <th>가입일</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>경고처리</th>
            <th>회원등급</th>
          </tr>
        </thead>
        <tbody className="admin-tbody">
          {memberList &&
            memberList.map((member, index) => {
              return (
                <tr key={"member-" + index}>
                  <td>
                    {member.memberThumb ? (
                      <img
                        src="/image/default_img.png"
                        style={{ width: "40px", height: "40px" }}
                      />
                    ) : (
                      <img
                        src="/image/default_img.png"
                        style={{ width: "40px", height: "40px" }}
                      />
                    )}
                  </td>
                  <td>{member.memberId}</td>
                  <td>{member.joinDate}</td>
                  <td>{member.memberEmail}</td>
                  <td>{member.memberPhone}</td>
                  <td>
                    <select
                      className="warning-select"
                      name="warningLevel"
                      value={member.warningLevel}
                      onChange={(e) => selectChange(e, index)}
                    >
                      <option value={1}>일반</option>
                      <option value={2}>경고</option>
                      <option value={3}>블랙</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="type-select"
                      name="memberLevel"
                      value={member.memberLevel}
                      onChange={(e) => selectChange(e, index)}
                    >
                      <option value={1}>관리자</option>
                      <option value={2}>정회원</option>
                    </select>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="admin-member-navi">
        <div>페이징 장소</div>
      </div>
    </div>
  );
};

export default AdminMember;
