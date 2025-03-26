import React, { useState } from "react";
import axios from "axios";

const AdminAds = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/ads", {
        title,
        image,
        link,
      });
      alert("광고 추가 완료!");
    } catch (error) {
      alert("광고 추가 실패");
    }
  };

  return (
    <div>
      <h1>광고 추가</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="광고 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="광고 이미지 URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <input
          type="text"
          placeholder="광고 링크"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button type="submit">광고 추가</button>
      </form>
    </div>
  );
};

export default AdminAds;
