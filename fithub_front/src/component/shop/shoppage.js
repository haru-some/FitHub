const ReviewsComponent = ({ reviews }) => {
  const navigate = useNavigate();
  const reviewsPerPage = 5; // 페이지당 리뷰 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호

  // 현재 페이지에 해당하는 리뷰 계산
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;

  // 'reviews'가 유효할 경우에만 슬라이싱 수행
  const currentReviews = Array.isArray(reviews)
    ? reviews.slice(indexOfFirstReview, indexOfLastReview)
    : [];

  // 페이지 수 계산
  const pageCount = Math.ceil(
    (Array.isArray(reviews) ? reviews.length : 0) / reviewsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {currentReviews.length > 0 ? (
        <ul>
          {currentReviews.map((review, index) => (
            <li
              key={"review-" + index}
              onClick={() => navigate(`/shop/detail/${review.goodsNo}`)}
            >
              <div>{review.goodsName}</div>
              <div className="review-flex">
                <div className="my-star-point">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                      {star <= review.reStar ? (
                        <StarIcon />
                      ) : (
                        <StarBorderIcon />
                      )}
                    </span>
                  ))}
                </div>
                <div className="review-date">{review.reDate}</div>
              </div>
              <div>{review.reContent}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>작성된 리뷰가 없습니다.</p>
      )}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          이전
        </button>
        {Array.from({ length: pageCount }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button
          disabled={currentPage === pageCount}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default ReviewsComponent;
