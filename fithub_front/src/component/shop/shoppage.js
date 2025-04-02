const submit = () => {
  const form = new FormData();
  form.append("goodsName", goodsName); // 사용자가 입력한 제목
  form.append("goodsPrice", price); // 설정된 가격
  form.append("goodsExpl", goodsExpl); // 상품 설명
  form.append("goodsUrl", goodsUrl); // 썸네일 URL 추가

  if (thumbnail) {
    form.append("thumbnail", thumbnail); // 썸네일 파일 추가
  }

  goodsFile.forEach((file) => {
    form.append("goodsFile", file); // 첨부 파일 추가
  });

  const backServer = process.env.REACT_APP_BACK_SERVER;

  axios
    .post(`${backServer}/goods`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      Swal.fire({
        icon: "success",
        title: "상품이 등록되었습니다!",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/admin");
    })
    .catch((err) => {
      console.error("상품 등록 실패:", err);
      Swal.fire({
        icon: "error",
        title: "상품 등록 실패",
        text: err.message,
      });
    });
};
