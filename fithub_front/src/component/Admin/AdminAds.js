import React, { useEffect, useState } from "react";
import axios from "axios";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";

const AdminAds = () => {
  const [adsList, setAdsList] = useState([]);
  const [ads, setAds] = useState([
    {
      adsName: "",
      adsLink: "",
      adsType: "",
    },
  ]);
  const [adsImg, setAdsImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/admin/getAds`)
      .then((res) => {
        console.log(res);
        setAdsList(res.data);
      })
      .catch((err) => {});
  }, [reload]);

  const writeAds = () => {
    const formData = new FormData();
    formData.append("adsName", ads.adsName);
    formData.append("adsLink", ads.adsLink);
    formData.append("adsImg", adsImg);

    axios
      .post(`${process.env.REACT_APP_BACK_SERVER}/admin/writeAds`, formData, {
        headers: {
          contentType: "multipart/form-data",
          processData: false,
        },
      })
      .then((res) => {
        alert("광고가 성공적으로 등록되었습니다!");
        setAds({ adsName: "", adsLink: "", adsType: "" });
        setAdsImg(null);
        setPreviewImg(null);
        setReload((prev) => !prev);
      })
      .catch((err) => {
        console.error(err);
        alert("광고 등록에 실패했습니다.");
      });
  };

  const deleteAds = (adsNo) => {
    axios
      .delete(`${process.env.REACT_APP_BACK_SERVER}/admin/deleteAds/${adsNo}`)
      .then((res) => {
        alert("삭제되었습니다");
        setReload((prev) => !prev);
      })
      .catch((err) => {
        console.error(err);
        alert("삭제 실패");
      });
  };

  const inputAds = (e) => {
    const name = e.target.name;
    const inputData = e.target.value;
    setAds({ ...ads, [name]: inputData });
  };

  const adsThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdsImg(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewImg(reader.result);
      };
    } else {
      setAdsImg(null);
      setPreviewImg(null);
    }
  };
  console.log(adsList);
  return (
    <section className="ads-section">
      <h1 className="page-title">광고 추가</h1>
      <div className="ads-list">
        <div>현재 진행 중인 광고</div>
        <div className="list-box">
          <div className="one-list">
            <div>이름(회사명)</div>
            <div style={{ width: "20%", textAlign: "center" }}>이미지</div>
            <div style={{ width: "25%" }}>주소 리스트</div>
            <div>게시일</div>
            <div>타입</div>
            <div>삭제</div>
          </div>
          {adsList &&
            adsList.map((ad, index) => {
              return (
                <div key={"ad-" + index} className="one-list">
                  <div>{ad.adsName}</div>
                  <div>{ad.adsImg}</div>
                  <div>{ad.adsLink}</div>
                  <div>{ad.adsDate}</div>
                  <div>{ad.adsType}</div>
                  <div onClick={() => deleteAds(ad.adsNo)}>
                    <DisabledByDefaultIcon />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <form className="ads-form">
        <div className="ads-title-box">
          <div>광고 추가하기</div>
        </div>
        <div className="ads-name-input-box">
          <input
            type="text"
            placeholder="광고 제목"
            value={ads.adsName}
            onChange={inputAds}
            name="adsName"
          />
        </div>
        <div className="ads-link-input-box">
          <input
            type="text"
            placeholder="광고 링크"
            value={ads.adsLink}
            onChange={inputAds}
            name="adsLink"
          />
        </div>
        <div className="ads-img-input-box">
          <label htmlFor="adsImg" className="ads-input">
            {!previewImg ? (
              <div className="ads-img-box">
                <ImageSearchIcon />
                +이미지를 추가해주세요
              </div>
            ) : (
              <div className="ads-img-box">
                <img src={previewImg} alt="미리보기" />
              </div>
            )}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={adsThumbnail}
            id="adsImg"
            name="adsImg"
            hidden
          />
        </div>
        <div className="ads-size-input-box">
          <select
            name="adsType"
            value={ads.adsDirection || ""}
            onChange={inputAds}
          >
            <option value="">배너 방향 선택</option>
            <option value="w">가로 (width)</option>
            <option value="h">세로 (height)</option>
          </select>
        </div>
        <div className="ads-button">
          <button type="button" onClick={writeAds}>
            광고 추가
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminAds;
