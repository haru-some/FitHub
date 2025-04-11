import React, { useState } from "react";
import axios from "axios";

const AdminAds = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState([]);
  const [link, setLink] = useState("");
  const [ads, setAds] = useState([
    {
      adsName: "",
      adsImg: "",
      adsLink: "",
    },
  ]);

  const adsWrite = () => {
    setAds();
    axios.post(`${process.env.REACT_APP_BACK_SERVER}/admin/ads`);
  };
  const inputAds = (e) => {
    const files = e.target.files;
    const name = e.target.name;
    const inputData = e.target.value;
    if (files.length === 0) {
      setImage([]);
    } else {
      const filenameArr = new Array(); //화면에 파일 이름을 출력하기 위한 배열
      for (let i = 0; i < files.length; i++) {
        filenameArr.push(files[i].name);
      }
      setImage([...image, ...filenameArr]);
    }
  };

  return (
    <section className="ads-section">
      <h1 className="page-title">광고 추가</h1>
      <div>
        <div>현재 진행 중인 광고</div>
        <div>현재 광고중인 목록</div>
        <div>
          <div></div>
        </div>
      </div>
      <form>
        {/* onSubmit={handleSubmit} */}
        <div className="ads-name-input-box">
          <input
            type="text"
            placeholder="광고 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="ads-link-input-box">
          <input
            type="text"
            placeholder="광고 링크"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <div className="ads-img-input-box">
          <label htmlFor="adsFile" className="ads-input">
            {image && image.length > 0 ? (
              <div className="ads-img-box">
                {image.map((item, index) => (
                  <div key={`image-${index}`}>{item}</div>
                ))}
              </div>
            ) : (
              <div className="ads-img-box">이미지 없음</div>
            )}
          </label>
          <input
            type="file"
            placeholder="광고 이미지"
            onChange={inputAds}
            id="adsFile"
            name="adsFile"
            multiple
            hidden
          />
        </div>
        <button type="submit">광고 추가</button>
      </form>
    </section>
  );
};

export default AdminAds;
