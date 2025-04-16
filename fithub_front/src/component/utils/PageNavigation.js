const PageNavigation = (props) => {
  const pi = props.pi;
  const reqPage = props.reqPage;
  const setReqPage = props.setReqPage;
  //paging을 하는 jsx가 저장될 배열
  const arr = new Array();
  //제일 앞으로 (1페이지로 이동)
  arr.push(
    <li
      key="first-page"
      onClick={() => {
        setReqPage(1);
      }}
    >
      <span className="material-icons page-item">first_page</span>
    </li>
  );
  //이전 페이지(현재 요청페이지보다 하나 전 -> reqPage -1)
  arr.push(
    <li
      key="prev-page"
      onClick={() => {
        if (reqPage !== 1) {
          setReqPage(reqPage - 1);
        }
      }}
    >
      <span className="material-icons page-item">navigate_before</span>
    </li>
  );
  //페이지 숫자
  let pageNo = pi.pageNo;
  for (let i = 0; i < pi.pageNaviSize; i++) {
    arr.push(
      <li
        key={"page-" + i}
        onClick={(e) => {
          const pageNumber = e.target.innerText;
          setReqPage(Number(pageNumber));
        }}
      >
        <span
          className={pageNo === reqPage ? "page-item active-page" : "page-item"}
        >
          {pageNo}
        </span>
      </li>
    );
    pageNo++;
    if (pageNo > pi.totalPage) {
      break;
    }
  }
  //다음 페이지(현재 요청페이지보다 하나 후 -> reqPage +1)
  arr.push(
    <li
      key="next-page"
      onClick={() => {
        if (reqPage !== pi.totalPage) {
          setReqPage(reqPage + 1);
        }
      }}
    >
      <span className="material-icons page-item">navigate_next</span>
    </li>
  );
  //마지막페이지(totalPage)
  arr.push(
    <li
      key="last-page"
      onClick={() => {
        setReqPage(pi.totalPage);
      }}
    >
      <span className="material-icons page-item">last_page</span>
    </li>
  );
  return <ul className="pagination">{arr}</ul>;
};

export default PageNavigation;
