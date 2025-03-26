import { useState } from "react";

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
    name: "단백질 보충제",
    price: "30,000원",
    category: "보충제",
    image: "/image/default_img.png",
  },
  {
    id: 4,
    name: "아미노산",
    price: "25,000원",
    category: "스포트웨어",
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
    name: "크레아틴",
    price: "22,000원",
    category: "스포트웨어",
    image: "/image/default_img.png",
  },
];

const categories = ["모두", "보충제", "스포트웨어", "비타민"];

const Advertisements = () => {
  const [currentAd, setCurrentAd] = useState(0);
  const ads = ["광고 1", "광고 2", "광고 3"];

  const nextAd = () => {
    setCurrentAd((prevAd) => (prevAd + 1) % ads.length);
  };

  return (
    <div>
      <div onClick={nextAd}>
        <h2>{ads[currentAd]}</h2>
      </div>
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
    setSelectedCategory(category);
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

      <div>
        {sortedProducts.map((product) => (
          <div key={product.id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ShopList = () => {
  return (
    <div>
      <ProductList />
      <Advertisements />
    </div>
  );
};

export default ShopList;
