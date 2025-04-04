import { useState } from "react";
import { useParams } from "react-router-dom";

const DmList = () => {
    const params = useParams();
    const memberNo = params.memberNo;
    const [searchText, setSearchText] = useState("");

    return(
        <div className="myfit-dm-wrap">
      <div className="input-wrap">
        <input
          type="text"
          placeholder="검색"
          className="search-input"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
        {/* <span class="material-icons search-btn" onClick={searchResult}>
          search
        </span> */}
      </div>

      <ul className="user-list">
        <li className="user-item-wrap">
            <div
            className="user-item"
            onClick={() => {
              //navigate(`/myfit/activity/${member.memberNo}`);
            }}
            >
                <div className="avatar-wrap">
                    <img
                    src="/image/default_img.png"
                    className="avatar"
                    />
                </div>
                <div className="user-info">
                    <div className="info-wrap">
                        <div className="name">user01</div>
                        <div className="username">유저1</div>
                    </div>
                    <div className="dm-item-content">내용내용내용내용내용내용</div>
                </div>
            </div>
        </li>
        <li className="user-item-wrap">
            <div
            className="user-item"
            onClick={() => {
              //navigate(`/myfit/activity/${member.memberNo}`);
            }}
            >
                <div className="avatar-wrap">
                    <img
                    src="/image/default_img.png"
                    className="avatar"
                    />
                </div>
                <div className="user-info">
                    <div className="info-wrap">
                        <div className="name">user02</div>
                        <div className="username">유저2</div>
                    </div>
                    <div className="dm-item-content">ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ</div>
                </div>
            </div>
        </li>
        <li className="user-item-wrap">
            <div
            className="user-item"
            onClick={() => {
              //navigate(`/myfit/activity/${member.memberNo}`);
            }}
            >
                <div className="avatar-wrap">
                    <img
                    src="/image/default_img.png"
                    className="avatar"
                    />
                </div>
                <div className="user-info">
                    <div className="info-wrap">
                        <div className="name">user03</div>
                        <div className="username">유저3</div>
                    </div>
                    <div className="dm-item-content">앗살라말라이쿰 이이잉</div>
                </div>
            </div>
        </li>
        <li className="user-item-wrap">
            <div
            className="user-item"
            onClick={() => {
              //navigate(`/myfit/activity/${member.memberNo}`);
            }}
            >
                <div className="avatar-wrap">
                    <img
                    src="/image/default_img.png"
                    className="avatar"
                    />
                </div>
                <div className="user-info">
                    <div className="info-wrap">
                        <div className="name">user04</div>
                        <div className="username">유저4</div>
                    </div>
                    <div className="dm-item-content">료이키 텐카이 후쿠마미즈시</div>
                </div>
            </div>
        </li>
        <li className="user-item-wrap">
            <div
            className="user-item"
            onClick={() => {
              //navigate(`/myfit/activity/${member.memberNo}`);
            }}
            >
                <div className="avatar-wrap">
                    <img
                    src="/image/default_img.png"
                    className="avatar"
                    />
                </div>
                <div className="user-info">
                    <div className="info-wrap">
                        <div className="name">user05</div>
                        <div className="username">유저5</div>
                    </div>
                    <div className="dm-item-content">츠키노 코큐 이치노카타</div>
                </div>
            </div>
        </li>
        <li className="user-item-wrap">
            <div
            className="user-item"
            onClick={() => {
              //navigate(`/myfit/activity/${member.memberNo}`);
            }}
            >
                <div className="avatar-wrap">
                    <img
                    src="/image/default_img.png"
                    className="avatar"
                    />
                </div>
                <div className="user-info">
                    <div className="info-wrap">
                        <div className="name">user06</div>
                        <div className="username">유저6</div>
                    </div>
                    <div className="dm-item-content">삐끼삐끼</div>
                </div>
            </div>
        </li>
        <li className="user-item-wrap">
            <div
            className="user-item"
            onClick={() => {
              //navigate(`/myfit/activity/${member.memberNo}`);
            }}
            >
                <div className="avatar-wrap">
                    <img
                    src="/image/default_img.png"
                    className="avatar"
                    />
                </div>
                <div className="user-info">
                    <div className="info-wrap">
                        <div className="name">user07</div>
                        <div className="username">유저7</div>
                    </div>
                    <div className="dm-item-content">ㅋㅋㄹㅃㅃㅃ</div>
                </div>
            </div>
        </li>
        <li className="user-item-wrap">
            <div
            className="user-item"
            onClick={() => {
              //navigate(`/myfit/activity/${member.memberNo}`);
            }}
            >
                <div className="avatar-wrap">
                    <img
                    src="/image/default_img.png"
                    className="avatar"
                    />
                </div>
                <div className="user-info">
                    <div className="info-wrap">
                        <div className="name">user08</div>
                        <div className="username">유저8</div>
                    </div>
                    <div className="dm-item-content">무량공처.</div>
                </div>
            </div>
        </li>
      </ul>
      <button
        className="back-btn"
        onClick={() => {
          //navigate(`/myfit/activity/${memberNo}`);
        }}
      >
        <span class="material-icons">reply</span>
      </button>
    </div>
    )
}

export default DmList