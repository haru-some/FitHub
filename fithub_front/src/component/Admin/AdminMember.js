import axios from "axios";
import { useEffect, useState } from "react";

const AdminMember = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [memberList, setMemberList] = useState(null);
  useEffect(() => {
    axios
      .get(`${backServer}/admin/member`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      <div>회원 관리</div>
      <MemberList memberList={memberList} />
    </div>
  );
};

const MemberList = (props) => {
  const memberList = props.memberList;
  return (
    <div>
      <table>
        <thead>
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
        <tbody>
          {memberList &&
            memberList.map((member, index) => {
              <tr key={"member-" + index}>
                <td>{member.memberThumb}</td>
                <td>{member.memberId}</td>
                <td>{member.joinDate}</td>
                <td>{member.memberEmail}</td>
                <td>{member.memberPhone}</td>
                <td>{member.warningLevel}</td>
                <td>{member.memberLevel}</td>
              </tr>;
            })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMember;
