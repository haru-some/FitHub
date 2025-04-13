import { useEffect, useState } from "react";
import "./shopLIst.css";
import { useNavigate } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";
import Swal from "sweetalert2";

import { useRecoilState, useRecoilValue } from "recoil";
import { memberState, isLoginState } from "../utils/RecoilData";
import AdBanners from "../utils/AdBanners";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";

const categories = [
  "모두",
  "보충제",
  "비타민",
  "스포츠웨어남",
  "스포츠웨어여",
  "운동기구",
];

const cate = {
  보충제: 1,
  비타민: 2,
  스포츠웨어남: 3,
  스포츠웨어여: 4,
  운동기구: 5,
};

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
      <AdBanners adsType={"w"} />
      <button onClick={nextAd}>→</button>
    </div>
  );
};

const GoodsList = () => {
  const [Goods, setGoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("모두");
  const [sort, setSort] = useState("최신순");
  const [currentPage, setCurrentPage] = useState(1);
  const GoodsPerPage = 8;
  const [clickedButton, setClickedButton] = useState(null);
  const [reqPage, setReqPage] = useState(1);

  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();

  const [memberInfo, setMemberInfo] = useRecoilState(memberState);
  const isLogin = useRecoilValue(isLoginState);

  useEffect(() => {
    axios
      .get(`${backServer}/goods?reqPage=${reqPage}`)
      .then((res) => {
        console.log(res.data.list);
        setGoods(res.data.list ? res.data.list : []);
        setCurrentPage(1); // 데이터가 바뀌면 현재 페이지를 초기화
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);

  //관리자 삭제
  const adminDelete = (goodsNo) => {
    Swal.fire({
      title: "삭제하시겠습니까?",
      text: "이 작업은 되돌릴 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#45a049",
      cancelButtonColor: "#d33",
      confirmButtonText: "예, 삭제합니다!",
      cancelButtonText: "아니요, 취소합니다.",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${backServer}/goods/${goodsNo}`).then((res) => {
          // 성공적으로 삭제된 후 상태 업데이트
          setGoods(Goods.filter((goods) => goods.goodsNo !== goodsNo));
        });
        // 상태에서 즉각 삭제하는 경우
        // setGoods(Goods.filter((goods) => goods.goodsNo !== goodsNo));
      }
    });
  };

  //관리자 상품 수정페이지
  const adminModify = (goodsNo) => {
    Swal.fire({
      title: "수정하시겠습니까?",
      text: "수정 페이지로 이동합니다..",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#45a049",
      cancelButtonColor: "#d33",
      confirmButtonText: "예, 수정합니다!",
      cancelButtonText: "아니요, 취소합니다.",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/shop/modify/${goodsNo}`);
      }
    });
  };

  //카테고리
  const handleCategoryChange = (category) => {
    setSelectedCategory(category); // 카테고리 변경 시 상태 업데이트
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 돌아가기
    setClickedButton(category); // 선택된 버튼명을 상태로 저장
  };

  const filteredGoods = Goods.filter((goods) =>
    selectedCategory === "모두"
      ? true
      : goods.goodsCategory === cate[selectedCategory]
  );

  const sortedGoods = filteredGoods.sort((a, b) => {
    const aPrice = a.goodsPrice; // 가격은 숫자 타입
    const bPrice = b.goodsPrice;

    if (sort === "가격높은순") {
      return bPrice - aPrice;
    } else if (sort === "가격낮은순") {
      return aPrice - bPrice;
    }
    return 0; // 기본 정렬
  });

  // 페이지네이션 적용
  const indexOfLastGoods = currentPage * GoodsPerPage;
  const indexOfFirstGoods = indexOfLastGoods - GoodsPerPage;
  // currentGoods는 항상 sortedGoods에서 슬라이스해서 얻음
  const currentGoods = sortedGoods.slice(indexOfFirstGoods, indexOfLastGoods);

  const totalPages = Math.ceil(sortedGoods.length / GoodsPerPage);

  const renderPagination = () => {
    const buttons = [];

    // 이전 페이지 버튼
    buttons.push(
      <button
        key="prev"
        onClick={() => {
          if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }}
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
        onClick={() => {
          if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
          }
        }}
        disabled={currentPage === totalPages}
      >
        <NavigateNextIcon />
      </button>
    );

    return buttons;
  };

  return (
    <div>
      {/* 카테고리 버튼 구현 */}
      <div>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            style={{
              backgroundColor:
                clickedButton === category ? "#245329" : "#589c5f",
            }}
          >
            {category.includes("스포츠웨어")
              ? category.replace("남", "(남)").replace("여", "(여)")
              : category}
          </button>
        ))}
      </div>
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="최신순">최신순</option>
        <option value="가격높은순">가격높은순</option>
        <option value="가격낮은순">가격낮은순</option>
      </select>

      <div className="goods-container">
        {memberInfo?.memberLevel === 1
          ? currentGoods.map((goods) => (
              <div
                className="goods-card"
                key={goods.goodsNo} // goodsNo를 키로 사용
                onClick={() => navigate(`/shop/detail/${goods.goodsNo}`)}
              >
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation(); // 버튼 클릭 시 카드 클릭 이벤트 방지
                    adminDelete(goods.goodsNo);
                  }}
                >
                  <ClearIcon />
                </button>
                <button
                  className="modify-button"
                  onClick={(e) => {
                    e.stopPropagation(); // 버튼 클릭 시 카드 클릭 이벤트 방지
                    adminModify(goods.goodsNo);
                  }}
                >
                  <FormatPaintIcon />
                </button>
                <img
                  src={
                    goods.goodsImage
                      ? `${backServer}/shop/thumb/${goods.goodsImage}`
                      : "/image/default_img.png"
                  }
                  alt={goods.goodsName}
                />
                <div className="goods-details">
                  <h3>{goods.goodsName}</h3>
                  <p>{goods.goodsPrice.toLocaleString()} 원</p>
                </div>
              </div>
            ))
          : currentGoods.map((goods) => (
              <div
                className="goods-card"
                key={goods.goodsNo} // goodsNo를 키로 사용
                onClick={() => navigate(`/shop/detail/${goods.goodsNo}`)}
              >
                <img
                  src={
                    goods.goodsImage
                      ? `${backServer}/shop/thumb/${goods.goodsImage}`
                      : "/image/default_img.png"
                  }
                  alt={goods.goodsName}
                />
                <div className="goods-details">
                  <h3>{goods.goodsName}</h3>
                  <p>{goods.goodsPrice.toLocaleString()} 원</p>
                </div>
              </div>
            ))}
      </div>
      <div className="page-wrap">
        {/* 페이지네이션 */}
        <div className="pagination">{renderPagination()}</div>
      </div>
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
      <GoodsList Goods setSelectedCategory={setSelectedCategory} />
    </div>
  );
};

export default ShopList;
