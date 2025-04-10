import axios from "axios";
import { useEffect, useState } from "react";
import PageNavigation from "../utils/PageNavigation";
import { useNavigate } from "react-router-dom";

const AdminMember = () => {
  const [tabChange, setTabChange] = useState(1);

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
            <div className="member-list-tbl">
              <MemberListTBL tabChange={tabChange} />
            </div>
            <div className="del-member-list-tbl">
              <DelMemberListTBL tabChange={tabChange} />
            </div>
          </div>
        ) : (
          <div className="board-manage">
            <div className="board-list-tbl">
              <CommunityListTBL tabChange={tabChange} />
            </div>
            <div className="comment-list-tbl">
              <CommentListTBL tabChange={tabChange} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const MemberListTBL = ({ tabChange }, props) => {
  const [memberList, setMemberList] = useState([]);
  const [memberPage, setMemberPage] = useState(1);
  const [memberPagNavi, setMemberPagNavi] = useState(null);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/admin/memberList?memberPage=${memberPage}`
      )
      .then((res) => {
        setMemberList(res.data.memberList);
        setMemberPagNavi(res.data.memberPi);
      })
      .catch((err) => {
        console.log("member 에러");
      });
  }, [tabChange, memberPage]);

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
        <thead className="admin-thead member-thead">
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
        <div>
          {memberPagNavi && (
            <PageNavigation
              pi={memberPagNavi}
              reqPage={memberPage}
              setReqPage={setMemberPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const DelMemberListTBL = ({ tabChange }, props) => {
  const [delMemberList, setDelMemberList] = useState();
  const [delMemberPage, setDelMemberPage] = useState(1);
  const [delMemberPagNavi, setDelMemberPagNavi] = useState(null);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/admin/delMemberList?delMemberPage=${delMemberPage}`
      )
      .then((res) => {
        setDelMemberList(res.data.delMemberList);
        setDelMemberPagNavi(res.data.delMemberPi);
      })
      .catch((err) => {
        console.log("delMember 에러");
      });
  }, [tabChange, delMemberPage]);
  return (
    <div>
      <table className="admin-tbl">
        <thead className="admin-thead del-member-thead">
          <tr>
            <th>아이디</th>
            <th>가입일</th>
            <th>탈퇴일</th>
            <th>이메일</th>
          </tr>
        </thead>
        <tbody className="admin-tbody">
          {delMemberList &&
            delMemberList.map((delMember, index) => {
              return (
                <tr key={"delMember-" + index}>
                  <td>{delMember.memberId}</td>
                  <td>{delMember.joinDate}</td>
                  <td>{delMember.delDate}</td>
                  <td>{delMember.memberEmail}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="admin-member-navi">
        <div>
          {delMemberPagNavi && (
            <PageNavigation
              pi={delMemberPagNavi}
              reqPage={delMemberPage}
              setReqPage={setDelMemberPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const CommunityListTBL = ({ tabChange }) => {
  const [communityList, setCommunityList] = useState();
  const [communityPage, setCommunityPage] = useState(1);
  const [communityPagNavi, setCommunityPagNavi] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/admin/communityList?communityPage=${communityPage}`
      )
      .then((res) => {
        console.log(res);
        setCommunityList(res.data.communityList);
        setCommunityPagNavi(res.data.communityPi);
      })
      .catch((err) => {
        console.log(err);
        console.log("community 에러");
      });
  }, [tabChange, communityPage]);

  console.log(communityPagNavi);
  return (
    <div>
      <table className="admin-tbl">
        <thead className="admin-thead community-thead">
          <tr>
            <th style={{ width: "20%" }}>아이디</th>
            <th style={{ width: "50%" }}>내용</th>
            <th style={{ width: "30%" }}>작성일</th>
          </tr>
        </thead>
        <tbody className="admin-tbody">
          {communityList &&
            communityList.map((community, index) => {
              return (
                <tr key={"community-" + index}>
                  <td>{community.memberId}</td>
                  <td
                    onClick={(e) => {
                      navigate(`/community/view/${community.communityNo}`);
                    }}
                  >
                    {community.communityContent}
                  </td>
                  <td>{community.communityDate}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="admin-member-navi">
        <div>
          {communityPagNavi && (
            <PageNavigation
              pi={communityPagNavi}
              reqPage={communityPage}
              setReqPage={setCommunityPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const CommentListTBL = ({ tabChange }) => {
  const [commentList, setCommentList] = useState();
  const [commentPage, setCommentPage] = useState(1);
  const [commentPagNavi, setCommentPagNavi] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/admin/commentList?commentPage=${commentPage}`
      )
      .then((res) => {
        console.log(res.data.commentList);
        setCommentList(res.data.commentList);
        setCommentPagNavi(res.data.commentPi);
      })
      .catch((err) => {
        console.log("comment 에러");
      });
  }, [tabChange, commentPage]);
  return (
    <div>
      <table className="admin-tbl">
        <thead className="admin-thead comment-thead">
          <tr>
            <th style={{ width: "10%" }}>작성자</th>
            <th style={{ width: "50%" }}>내용</th>
            <th style={{ width: "20%" }}>관련글</th>
            <th style={{ width: "20%" }}>작성일</th>
          </tr>
        </thead>
        <tbody className="admin-tbody">
          {commentList &&
            commentList.map((comment, index) => {
              return (
                <tr key={"community-" + index}>
                  <td>{comment.memberId}</td>
                  <td
                    onClick={(e) => {
                      navigate(`/community/view/${comment.communityNo}`);
                    }}
                  >
                    {comment.commentContent}
                  </td>
                  <td>{comment.communityNo}</td>
                  <td>{comment.commentDate}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="admin-member-navi">
        <div>
          {commentPagNavi && (
            <PageNavigation
              pi={commentPagNavi}
              reqPage={commentPage}
              setReqPage={setCommentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMember;
