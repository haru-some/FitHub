import { useEffect, useState } from "react";
import "./shopLIst.css";
import ProductPage from "./ProductPage";

const allProducts = [
  {
    id: 1,
    name: "비타민 A",
    price: "10,000원",
    category: "비타민",
    image: "/image/default_img.png",
  },
  {
    id: 2,
    name: "비타민 B",
    price: "12,000원",
    category: "비타민",
    image: "/image/default_img.png",
  },
  {
    id: 3,
    name: "단백질 보충제A",
    price: "17,000원",
    category: "보충제",
    image: "/image/default_img.png",
  },
  {
    id: 4,
    name: "아미노산",
    price: "25,000원",
    category: "비타민",
    image: "/image/default_img.png",
  },
  {
    id: 5,
    name: "비타민 C",
    price: "8,000원",
    category: "비타민",
    image: "/image/default_img.png",
  },
  {
    id: 6,
    name: "비타민 D",
    price: "20,000원",
    category: "비타민",
    image: "/image/default_img.png",
  },
  {
    id: 7,
    name: "크레아틴B",
    price: "25,000원",
    category: "보충제",
    image: "/image/default_img.png",
  },
  {
    id: 8,
    name: "크레아틴C",
    price: "30,000원",
    category: "보충제",
    image: "/image/default_img.png",
  },
  {
    id: 9,
    name: "수트A",
    price: "20,000원",
    category: "스포츠웨어(남)",
    image: "/image/default_img.png",
  },
  {
    id: 10,
    name: "수트B",
    price: "22,000원",
    category: "스포츠웨어(남)",
    image: "/image/default_img.png",
  },
  {
    id: 11,
    name: "수트C",
    price: "30,000원",
    category: "스포츠웨어(남)",
    image: "/image/default_img.png",
  },
  {
    id: 12,
    name: "수트D",
    price: "27,000원",
    category: "스포츠웨어(남)",
    image: "/image/default_img.png",
  },
  {
    id: 13,
    name: "수트E",
    price: "21,000원",
    category: "스포츠웨어(남)",
    image: "/image/default_img.png",
  },
  {
    id: 14,
    name: "수트F",
    price: "23,000원",
    category: "스포츠웨어(남)",
    image: "/image/default_img.png",
  },
  {
    id: 15,
    name: "레깅스A",
    price: "17,000원",
    category: "스포츠웨어(여)",
    image: "/image/default_img.png",
  },
  {
    id: 16,
    name: "레깅스B",
    price: "9,000원",
    category: "스포츠웨어(여)",
    image: "/image/default_img.png",
  },
  {
    id: 17,
    name: "레깅스C",
    price: "10,000원",
    category: "스포츠웨어(여)",
    image: "/image/default_img.png",
  },
  {
    id: 18,
    name: "레깅스D",
    price: "14,000원",
    category: "스포츠웨어(여)",
    image: "/image/default_img.png",
  },
  {
    id: 19,
    name: "레깅스E",
    price: "26,000원",
    category: "스포츠웨어(여)",
    image: "/image/default_img.png",
  },
  {
    id: 20,
    name: "레깅스F",
    price: "25,000원",
    category: "스포츠웨어(여)",
    image: "/image/default_img.png",
  },
  {
    id: 21,
    name: "레깅스G",
    price: "24,000원",
    category: "스포츠웨어(여)",
    image: "/image/default_img.png",
  },
  {
    id: 22,
    name: "레깅스H",
    price: "22,000원",
    category: "스포츠웨어(여)",
    image: "/image/default_img.png",
  },
  {
    id: 23,
    name: "레깅스I",
    price: "29,000원",
    category: "스포츠웨어(여)",
    image: "/image/default_img.png",
  },
  {
    id: 24,
    name: "레깅스J",
    price: "30,000원",
    category: "스포츠웨어(여)",
    image: "/image/default_img.png",
  },
  {
    id: 25,
    name: "레깅스K",
    price: "16,000원",
    category: "스포츠웨어(여)",
    image: "/image/default_img.png",
  },
  {
    id: 26,
    name: "레깅스L",
    price: "17,000원",
    category: "스포츠웨어(여)",
    image: "/image/default_img.png",
  },
  {
    id: 27,
    name: "레깅스M",
    price: "18,000원",
    category: "스포츠웨어(여)",
    image: "/image/default_img.png",
  },
  {
    id: 28,
    name: "레깅스N",
    price: "19,000원",
    category: "스포츠웨어(여)",
    image: "/image/default_img.png",
  },
  {
    id: 29,
    name: "레깅스O",
    price: "20,000원",
    category: "스포츠웨어(여)",
    image: "/image/default_img.png",
  },
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

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("모두");
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
      <h2 style={{ textAlign: "center", margin: "20px 0" }}>
        {selectedCategory}
      </h2>
      {/* 선택된 카테고리를 중앙에 표시 */}
      <Advertisements />
      <ProductList
        products={allProducts} // allProducts를 전달
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  );
};

export default ShopList;
