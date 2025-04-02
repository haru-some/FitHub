
  useEffect(() => {
      axios
          .get(`${backServer}/goods?reqPage=1`)
          .then((res) => {
              console.log(res.data);
              setFetchedGoods(res.data.list || []);
          })
          .catch((err) => {
              console.error(err);
          });
  }, []);

  const handleSortChange = (event) => {
      setSort(event.target.value);
  };

  const handleCategoryChange = (category) => {
      setSelectedCategory(category);
      // 카테고리 하드코딩된 숫자로 변환한 것
  };

  const filteredGoods = fetchedGoods.filter((goods) =>
      selectedCategory === "모두"
          ? true
          : goods.goodsCategory === categoryMapping[selectedCategory] // 숫자로 비교
  );

  const sortedGoods = filteredGoods.sort((a, b) => {
      // Sorting logic remains unchanged
  });

  // Rendering logic remains unchanged.

  
  
  return (
      <div>
          {/* 카테고리 버튼 구현 */}
          <div>
              {Object.keys(categoryMapping).map((category) => (
                  <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                  >
                      {category}
                  </button>
              ))}
          </div>
          

          <div className="goods-container">
              {sortedGoods.length === 0 ? (
                  <p>상품이 없습니다.</p>
              ) : (
                  // Render goods
              )}
          </div>
      </div>
  );
};