import React, { useEffect, useState } from "react";
import "./profileCard.css";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { ResponsiveLine } from "@nivo/line";
import { useRecoilState } from "recoil";
import { memberState } from "../utils/RecoilData";
import axios from "axios";
import Swal from "sweetalert2";

const ProfileCard = (props) => {
  const setFlag = props.setFlag;

  const params = useParams();
  const memberNo = params.memberNo;
  const [loginMember, setLoginMember] = useRecoilState(memberState);
  const [act, setAct] = useState(1);
  const [actMember, setActMember] = useState(null);

  const [showSummary, setShowSummary] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/myfit/activity/${memberNo}?loginMemberNo=${loginMember.memberNo}`
      )
      .then((res) => {
        setActMember(res.data);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (act === 1) {
      // 한 프레임 뒤에 test 클래스 붙이기
      requestAnimationFrame(() => setShowSummary(true));
    } else {
      setShowSummary(false);
    }
  }, [act]);
  return (
    <div className="myfit-profile-card">
      {actMember && (
        <>
          <div className="myfit-profile-header">
            <div className="myfit-profile-icon">
              <img
                src={
                  actMember.memberThumb
                    ? `${process.env.REACT_APP_BACK_SERVER}/member/profileimg/${actMember.memberThumb}`
                    : "/image/default_img.png"
                }
              />
            </div>
            <div className="myfit-profile-info">
              <div className="name-wrap">
                <h2>{actMember.memberId}</h2>
                <h3>{actMember.memberName}</h3>
                {loginMember.memberNo !== Number(memberNo) && (
                  <span
                    className="material-icons chat-btn"
                    onClick={() => {
                      // 보낸사람/받은사람
                      navigate(
                        `/myfit/chat/${loginMember.memberNo}/${actMember.memberNo}`
                      );
                    }}
                  >
                    send
                  </span>
                )}
              </div>
              {actMember && (
                <div className="myfit-profile-stats">
                  <div>
                    <p>{actMember.communityCount}</p>
                    <p>게시물</p>
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate(`/myfit/follow/${actMember.memberNo}/1`);
                    }}
                  >
                    <p>{actMember.followerCount}</p>
                    <p>팔로워</p>
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate(`/myfit/follow/${actMember.memberNo}/2`);
                    }}
                  >
                    <p>{actMember.followingCount}</p>
                    <p>팔로잉</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="myfit-profile-actions">
            {loginMember.memberNo === Number(memberNo) ? (
              <Link to="/mypage">
                <button className="myfit-profile-button">프로필 편집</button>
              </Link>
            ) : (
              <button
                className={`follow-button ${
                  actMember.isFollow === 1 ? "following" : ""
                }`}
                onClick={() => {
                  if (actMember.isFollow === 1) {
                    //팔로우 취소
                    Swal.fire({
                      title: "팔로우 취소",
                      text: "정말 팔로우를 취소하시겠습니까?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "rgb(93, 187, 121)",
                      cancelButtonColor: "rgb(146, 146, 146)",
                      confirmButtonText: "예",
                      cancelButtonText: "아니오",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        axios
                          .delete(
                            `${process.env.REACT_APP_BACK_SERVER}/community/follow/${loginMember.memberNo}?followMemberNo=${memberNo}`
                          )
                          .then((res) => {
                            if (res.data > 0) {
                              actMember.isFollow = 0;
                              setActMember({ ...actMember });
                            }
                          });
                      }
                    });
                  } else {
                    //팔로우
                    axios
                      .post(
                        `${process.env.REACT_APP_BACK_SERVER}/community/follow/${loginMember.memberNo}?followMemberNo=${memberNo}`
                      )
                      .then((res) => {
                        if (res.data > 0) {
                          actMember.isFollow = 1;
                          setActMember({ ...actMember });
                        }
                      });
                  }
                }}
              >
                {actMember.isFollow === 1 ? "팔로잉" : "팔로우"}
              </button>
            )}

            <button
              className="myfit-profile-button"
              onClick={() => {
                setAct(act === 1 ? 2 : 1);
              }}
            >
              {act === 1 ? "My Fit 통계" : "My Fit 요약"}
            </button>
          </div>
          <div className="myfit-profile-summary">
            {act === 1 ? <h3>요약</h3> : <h3>주간 운동 통계</h3>}

            {act === 1 ? (
              <div className={`summary-wrap ${showSummary ? "test" : ""}`}>
                {actMember && (
                  <ul>
                    <li>
                      <span>
                        <span className="material-icons">edit_calendar</span>{" "}
                        <span>총 운동 일수</span>
                      </span>
                      <span>{actMember.totalRecordDays}일</span>
                    </li>
                    <li>
                      <span>
                        <span className="material-icons">av_timer</span>{" "}
                        <span>총 운동 시간</span>
                      </span>
                      <span>{`${Math.floor(
                        actMember.totalRecordTime / 60
                      )}시간 ${actMember.totalRecordTime % 60}분`}</span>
                    </li>
                    <li>
                      <span>
                        <span className="material-icons">edit_calendar</span>
                        <span>지난 1주 운동 일수</span>
                      </span>
                      <span>{actMember.weekRecordDays}일</span>
                    </li>
                    <li>
                      <span>
                        <span className="material-icons">av_timer</span>{" "}
                        <span>지난 1주 운동 시간</span>
                      </span>
                      <span>
                        {`${Math.floor(actMember.weekRecordTime / 60)}시간 ${
                          actMember.weekRecordTime % 60
                        }분`}
                      </span>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <div>
                <div className="chart-wrap">
                  <MyLineChart member={actMember} />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const MyLineChart = (props) => {
  const member = props.member;
  const [arr, setArr] = useState(null);
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/myfit/activity/graph/${member.memberNo}`
      )
      .then((res) => {
        setArr(res.data);
      })
      .catch((err) => {});
  }, []);
  useEffect(() => {
    if (arr) {
      const newArr = [
        {
          id: member.memberId,
          color: "hsl(327, 70%, 50%)",
          data: [
            {
              x: arr[0].recordDay,
              y: arr[0].totalTime,
            },
            {
              x: arr[1].recordDay,
              y: arr[1].totalTime,
            },
            {
              x: arr[2].recordDay,
              y: arr[2].totalTime,
            },
            {
              x: arr[3].recordDay,
              y: arr[3].totalTime,
            },
            {
              x: arr[4].recordDay,
              y: arr[4].totalTime,
            },
            {
              x: arr[5].recordDay,
              y: arr[5].totalTime,
            },
            {
              x: arr[6].recordDay,
              y: arr[6].totalTime,
            },
          ],
        },
      ];
      setData(newArr);
    }
  }, [arr]);
  return (
    <div style={{ height: 400, width: 700 }}>
      <ResponsiveLine
        data={data}
        colors={["rgb(113, 221, 158)"]}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "최근 7일 날짜",
          legendOffset: 36,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "운동 시간(분)",
          legendOffset: -40,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="data.yFormatted"
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        tooltip={({ point }) => (
          <div
            style={{
              background: "white",
              padding: "6px 9px",
              border: "1px solid #ccc",
              color: "black",
            }}
          >
            <strong>{point.data.x}</strong>일<br />
            운동시간: {point.data.y}분
          </div>
        )}
      />
    </div>
  );
};

export default ProfileCard;
