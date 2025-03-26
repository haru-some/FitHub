import React from "react";

const ProductPage = ({
  products,
  productsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  // 페이지네이션 전환할 페이지 수
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div>
      <div className="product-container">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>{product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            disabled={currentPage === index + 1} // 현재 페이지와 동일한 페이지 버튼 비활성화
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
