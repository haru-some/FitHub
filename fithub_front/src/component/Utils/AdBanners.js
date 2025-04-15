import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdBanners = ({ adsType }) => {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/admin/getAdsType?adsType=${adsType}`
      )
      .then((res) => {
        const adsArray = res.data;
        if (adsArray.length > 0) {
          const randomIndex = Math.floor(Math.random() * adsArray.length);
          setAd(adsArray[randomIndex]);
        }
      })
      .catch((err) => {
        console.log("광고 배너 가져오기 실패", err);
      });
  }, []);

  if (!ad) return null; // 데이터가 없을 때는 렌더링 X

  return (
    <div className="ad-banner">
      <Link to={ad.adsLink}>
        <img
          src={`${process.env.REACT_APP_BACK_SERVER}/ads/img/${ad.adsImg}`}
          alt={ad.adsName}
          style={{ objectFit: "contain" }}
        />
      </Link>
    </div>
  );
};

export default AdBanners;
