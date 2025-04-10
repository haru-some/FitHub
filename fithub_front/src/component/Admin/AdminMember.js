import axios from "axios";
import { useEffect, useState } from "react";
import PageNavigation from "../utils/PageNavigation";

const AdminMember = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [memberList, setMemberList] = useState([]);
  const [delMemberList, setDelMemberList] = useState();
  const [communityList, setCommunityList] = useState();
  const [commentList, setCommentList] = useState();
  const [memberPage, setMemberPage] = useState(null);
  const [delMemberPage, setDelMemberPage] = useState(null);
  const [communityPage, setCommunityPage] = useState(null);
  const [commentPage, setCommentPage] = useState(null);
  const [tabChange, setTabChange] = useState(1);
  const [reqPage, setReqPage] = useState(1);
  useEffect(() => {
    axios
      .get(`${backServer}/admin/memberList?memberPage=${memberPage}`)
      .then((res) => {
        console.log(res);
        setMemberList(res.data.memberList);
        setMemberPage(res.data.memberPi);
      })
      .catch((err) => {
        console.log(err);
        console.log("member 에러");
      });
  }, [tabChange === 1]);
  useEffect(() => {
    axios
      .get(`${backServer}/admin/delMemberList?delMemberPage=${delMemberPage}`)
      .then((res) => {
        console.log(res);
        setDelMemberList(res.data.delMemberList);
        setDelMemberPage(res.data.delMemberPi);
      })
      .catch((err) => {
        console.log(err);
        console.log("member 에러");
      });
  }, [tabChange === 1]);
  useEffect(() => {
    axios
      .get(
        `${backServer}/admin/boardList?communityPage=${communityPage}&commentPage=${commentPage}`
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        console.log("board 에러");
      });
  }, [tabChange === 2]);
  useEffect(() => {
    axios
      .get(
        `${backServer}/admin/boardList?communityPage=${communityPage}&commentPage=${commentPage}`
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
        console.log("board 에러");
      });
  }, [tabChange === 2]);
  const changeTab = (e) => {
    const member = e.target.id;
    if (member === "member") {
      setTabChange(1);
    } else {
      setTabChange(2);
    }
  };
  return (
    <section className="admin-member-section">
      <div className="admin-member-tab">
        <div
          className={tabChange === 1 ? "page-title active-tab" : "page-title"}
          id="member"
          onClick={changeTab}
        >
          회원 관리
        </div>
        <div
          className={tabChange === 2 ? "page-title active-tab" : "page-title"}
          id="board"
          onClick={changeTab}
        >
          게시글 관리
        </div>
      </div>
      <div className="admin-member-tab-content">
        {tabChange === 1 ? (
          <div className="member-manage">
            <div className="member-list">
              <MemberListTBL
                memberList={memberList}
                setMemberList={setMemberList}
              />
            </div>
            <div>
              {memberPage && (
                <PageNavigation
                  pi={memberPage}
                  reqPage={reqPage}
                  setReqPage={setReqPage}
                />
              )}
            </div>
            <div className="del-member-list">
              <DelMemberListTBL
                delMemberList={delMemberList}
                setDelMemberList={setDelMemberList}
              />
            </div>
            <div>
              {delMemberPage && (
                <PageNavigation
                  pi={delMemberPage}
                  reqPage={reqPage}
                  setReqPage={setReqPage}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="board-manage">
            <div className="board-list">
              <CommunityListTBL />
            </div>
            <div className="comment-list">
              <CommentListTBL />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const MemberListTBL = (props) => {
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

const DelMemberListTBL = (props) => {
  const delMemberList = props.delMemberList;
  const setDelMemberList = props.setDelMemberList;
  return (
    <div>
      <table className="admin-tbl">
        <thead className="admin-thead">
          <tr>
            <th>아이디</th>
            <th>가입일</th>
            <th>탈퇴일</th>
            <th>이메일</th>
          </tr>
        </thead>
        <tbody className="admin-tbody"></tbody>
      </table>
      <div className="admin-member-navi">
        <div>페이징 장소</div>
      </div>
    </div>
  );
};

const CommunityListTBL = () => {
  return (
    <div>
      <table className="admin-tbl">
        <thead className="admin-thead">
          <tr>
            <th>아이디</th>
            <th>내용</th>
            <th>작성일</th>
            <th>공개 설정</th>
          </tr>
        </thead>
        <tbody className="admin-tbody"></tbody>
      </table>
      <div className="admin-member-navi">
        <div>페이징 장소</div>
      </div>
    </div>
  );
};

const CommentListTBL = () => {
  return (
    <div>
      <table className="admin-tbl">
        <thead className="admin-thead">
          <tr>
            <th>아이디</th>
            <th>내용</th>
            <th>관련글</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody className="admin-tbody"></tbody>
      </table>
      <div className="admin-member-navi">
        <div>페이징 장소</div>
      </div>
    </div>
  );
};

export default AdminMember;
