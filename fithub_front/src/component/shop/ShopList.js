import { useEffect, useState } from "react";
import "./shopList.css";
import ProductPage from "./ProductPage";
import { useNavigate } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import axios from "axios";

const allGoods = [];

const categories = [
  "모두",
  "보충제",
  "비타민",
  "스포츠웨어(남)",
  "스포츠웨어(여)",
  "운동기구",
];

const Advertisements = () => {
  const [currentAd, setCurrentAd] = useState(0);
  const ads = ["광고 1", "광고 2", "광고 3"];

  const nextAd = () => {
    setCurrentAd((prevAd) => (prevAd + 1) % ads.length);
  };

  const previousAd = () => {
    setCurrentAd((prevAd) => (prevAd - 1 + ads.length) % ads.length);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextAd();
    }, 5000); // 5초마다 광고 전환

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="Banner-wrap">
      <button onClick={previousAd}>←</button>
      <div className="adBanner" onClick={nextAd}>
        <h2>{ads[currentAd]}</h2>
      </div>
      <button onClick={nextAd}>→</button>
    </div>
  );
};

const GoodsList = () => {
  const [allGoods, setAllGoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("모두");
  const [sort, setSort] = useState("최신순");
  const [currentPage, setCurrentPage] = useState(1);
  const GoodsPerPage = 8;
  const [clickedButton, setClickedButton] = useState(null);
  const [reqPage, setReqPage] = useState(1);

  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${backServer}/goods?reqPage=${reqPage}`)
      .then((res) => {
        console.log(res);
        setAllGoods(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category); // 카테고리 변경 시 상태 업데이트
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 돌아가기
    setClickedButton(category); // 선택된 버튼명을 상태로 저장
  };

  const filteredgoods = allGoods.filter((goods) =>
    selectedCategory === "모두" ? true : goods.category === selectedCategory
  );

  const sortedGoods = filteredgoods.sort((a, b) => {
    if (sort === "가격높은순") {
      return (
        parseInt(b.price.replace(/,/g, ""), 10) -
        parseInt(a.price.replace(/,/g, ""), 10)
      );
    } else if (sort === "가격낮은순") {
      return (
        parseInt(a.price.replace(/,/g, ""), 10) -
        parseInt(b.price.replace(/,/g, ""), 10)
      );
    }
    return 0; // 최신순에 대한 정렬은 기본적으로 원래 순서 유지
  });

  // 페이지네이션 적용
  const indexOfLastGoods = currentPage * GoodsPerPage;
  const indexOfFirstGoods = indexOfLastGoods - GoodsPerPage;
  const currentGoods = sortedGoods.slice(indexOfFirstGoods, indexOfLastGoods);
  const totalPages = Math.ceil(sortedGoods.length / GoodsPerPage);

  const renderPagination = () => {
    const buttons = [];

    // 이전 페이지 버튼
    buttons.push(
      <button
        key="prev"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <NavigateBeforeIcon />
      </button>
    );

    // 페이지 번호 버튼
    const totalPagesDisplayed = 5; // 항상 표시할 페이지 수
    let startPage = Math.max(1, currentPage - 2); // 현재 페이지를 기준으로 시작 페이지
    let endPage = Math.min(totalPages, startPage + totalPagesDisplayed - 1); // 끝 페이지

    // 시작 페이지가 1일 때 조정
    if (startPage === 1) {
      endPage = Math.min(totalPagesDisplayed, totalPages);
    }

    // 끝 페이지가 totalPages일 때 조정
    if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - totalPagesDisplayed + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          disabled={currentPage === i} // 현재 페이지에서는 비활성화
        >
          {i}
        </button>
      );
    }

    // 다음 페이지 버튼
    buttons.push(
      <button
        key="next"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages} // 마지막 페이지에서는 비활성화
      >
        <NavigateNextIcon />
      </button>
    );

    return buttons;
  };

  return (
    <div>
      <div>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            style={{
              backgroundColor:
                clickedButton === category ? "#245329" : "#589c5f", // 클릭되었을 때의 색상
            }}
          >
            {category}
          </button>
        ))}
      </div>
      <select value={sort} onChange={handleSortChange}>
        <option value="최신순">최신순</option>
        <option value="가격높은순">가격높은순</option>
        <option value="가격낮은순">가격낮은순</option>
      </select>

      <div className="goods-container">
        {currentGoods.map((goods) => (
          <div
            className="goods-card"
            key={goods.goodsName}
            onClick={() => {
              navigate(`/shop/detail/${goods.goodsName}`);
            }}
          >
            <img src={goods.goodsUrl} alt={goods.goodsName} />
            <div className="goods-details">
              <h3>{goods.goodsName}</h3>
              <p>{goods.goodsPrice}</p>
            </div>
          </div>
        ))}
      </div>
      {/* 페이지네이션 */}
      <div className="pagination">{renderPagination()}</div>
    </div>
  );
};

const ShopItem = () => {
  const navigate = useNavigate();
  return (
    <div className="goods-card" onClick={() => [navigate(`/shop/view/`)]}></div>
  );
};

const ShopList = () => {
  const [selectedCategory, setSelectedCategory] = useState("FIT MARKET");

  return (
    <div className="shop-list-wrap">
      <h2 style={{ textAlign: "center", margin: "20px 0" }}>
        {selectedCategory}
      </h2>
      <Advertisements />
      <GoodsList goods={allGoods} setSelectedCategory={setSelectedCategory} />
    </div>
  );
};

export default ShopList;
