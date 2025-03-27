import axios from "axios";
import { useEffect, useState } from "react";

const AdminMember = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [memberList, setMemberList] = useState(null);
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
      <div className="page-title">회원 관리</div>
      <MemberList memberList={memberList} />
    </section>
  );
};

const MemberList = (props) => {
  const memberList = props.memberList;
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
                        style={{ width: "40px" }}
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
                  <td>{member.warningLevel}</td>
                  <td>{member.memberLevel}</td>
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
