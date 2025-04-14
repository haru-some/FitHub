return (
  <div>
    <h2>내가 작성한 리뷰</h2>
    {review.length > 0 ? (
      <ul>
        {review.map((review, index) => (
          <li
            key={"review-" + index}
            onClick={() => {
              navigate(`/shop/detail/${review.goodsNo}`);
            }}
            style={{ position: "relative" }} // 추가: li의 position을 relative로 설정하세요
          >
            <div>{review.goodsName}</div>

            <div
              className="review-flex"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="my-star-point">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    {star <= review.reStar ? <StarIcon /> : <StarBorderIcon />}
                  </span>
                ))}
              </div>
              <div className="review-date">{review.reDate}</div>
              <div style={{ marginLeft: "auto" }}>
                {" "}
                {/* 추가: 이 div를 이용해 오른쪽 정렬 */}
                <button
                  className="delete-review"
                  onClick={(e) => {
                    e.stopPropagation(); // 버튼 클릭 시 카드 클릭 이벤트 방지
                    reviewDelete(review.reNo);
                  }}
                >
                  <ClearIcon />
                </button>
              </div>
            </div>
            <div>{review.reContent}</div>
          </li>
        ))}
      </ul>
    ) : (
      <p>작성된 리뷰가 없습니다.</p>
    )}
  </div>
);
