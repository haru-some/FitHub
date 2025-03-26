import React, { useEffect, useState } from "react";
import axios from "axios";

const AdBanners = () => {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/ads");
        setAd(response.data);
      } catch (error) {
        console.error("광고 로드 실패");
      }
    };

    fetchAd();
  }, []);

  if (!ad) return <div>광고를 불러오는 중...</div>;

  return (
    <div className="ad-banner">
      <a href={ad.link} target="_blank" rel="noopener noreferrer">
        <img src={ad.image} alt={ad.title} />
      </a>
    </div>
  );
};

export default AdBanners;
