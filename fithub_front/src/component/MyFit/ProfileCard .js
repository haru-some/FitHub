import React, { useEffect, useState } from "react";
import "./profileCard.css";
import { Link, Route, Routes } from "react-router-dom";
import { ResponsiveLine } from "@nivo/line";
import { useRecoilState } from "recoil";
import { memberState } from "../utils/RecoilData";
import axios from "axios";

const ProfileCard = () => {
  const [act, setAct] = useState(1);
  const [member, setMember] = useRecoilState(memberState);
  const [actMember, setActMember] = useState(null);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/myfit/activity/${member.memberNo}`
      )
      .then((res) => {
        console.log(res);

        setActMember(res.data);
      })
      .catch((err) => {});
  }, []);

  return (
    <div className="myfit-profile-card">
      <div className="myfit-profile-header">
        <div className="myfit-profile-icon">
          <img
            src={
              member.memberProfile
                ? `${process.env.REACT_APP_BACK_SERVER}/profile/${member.memberProfile}`
                : "/image/default_img.png"
            }
          />
        </div>
        <div className="myfit-profile-info">
          <div className="name-wrap">
            <h2>{member.memberName}</h2>
          </div>
          {actMember && (
            <div className="myfit-profile-stats">
              <div>
                <p>{actMember.communityCount}</p>
                <p>게시물</p>
              </div>
              <div>
                <p>{actMember.followerCount}</p>
                <p>팔로워</p>
              </div>
              <div>
                <p>{actMember.followingCount}</p>
                <p>팔로잉</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="myfit-profile-actions">
        <Link to="/member/info">
          <button className="myfit-profile-button">프로필 편집</button>
        </Link>
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
        {act === 1 ? (
          <div className="summary-wrap">
            <h3>요약</h3>
            {actMember && (
              <ul>
                <li>
                  <span>총 운동 일수 : </span>
                  <span>{actMember.totalRecordDays}일</span>
                </li>
                <li>
                  <span>총 운동 시간 : </span>
                  <span>{`${Math.floor(actMember.totalRecordTime / 60)}시간 ${
                    actMember.totalRecordTime % 60
                  }분`}</span>
                </li>
                <li>
                  <span>지난 1주 운동 일수 : </span>
                  <span>{actMember.weekRecordDays}일</span>
                </li>
                <li>
                  <span>지난 1주 운동 시간 : </span>
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
            <h3>주간 운동 통계</h3>
            <div className="chart-wrap">
              <MyLineChart member={member} />
            </div>
          </div>
        )}
      </div>
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
          legend: "주간 운동 통계",
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
      />
    </div>
  );
};

export default ProfileCard;
