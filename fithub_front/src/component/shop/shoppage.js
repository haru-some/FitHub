import { useEffect, useState } from "react";
import "./shopList.css";

const allProducts = [
  // ... (제품 리스트는 동일) ...
];

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

const ProductList = ({ setSelectedCategory }) => {
  const [sort, setSort] = useState("최신순");

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category); // 카테고리 변경 시 상태 업데이트
  };

  const filteredProducts = allProducts.filter((product) =>
    selectedCategory === "모두" ? true : product.category === selectedCategory
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
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

  return (
    <div>
      <div>
        {categories.map((category) => (
          <button key={category} onClick={() => handleCategoryChange(category)}>
            {category}
          </button>
        ))}
      </div>
      <select value={sort} onChange={handleSortChange}>
        <option value="최신순">최신순</option>
        <option value="가격높은순">가격높은순</option>
        <option value="가격낮은순">가격낮은순</option>
      </select>

      <div className="product-container">
        {sortedProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ShopList = () => {
  const [selectedCategory, setSelectedCategory] = useState("모두");

  return (
    <div>
      <h2 style={{ textAlign: "center", margin: "20px 0" }}>{selectedCategory}</h2> {/* 선택된 카테고리를 중앙에 표시 */}
      <Advertisements />
      <ProductList setSelectedCategory={setSelectedCategory} /> {/* 카테고리 상태 업데이트 함수 전달 */}
    </div>
  );
};

export default