import axios from "axios";

const backServer = process.env.REACT_APP_BACK_SERVER;

const instance = axios.create();

// 요청 인터셉터 설정 (기본 토큰 세팅)
instance.interceptors.request.use(
  (config) => {
    const memberData = JSON.parse(
      localStorage.getItem("recoil-persist")
    )?.memberState;
    if (memberData?.accessToken) {
      config.headers["Authorization"] = memberData.accessToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 설정 (401 발생 시 갱신)
instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // accessToken 만료로 인한 401 + 재시도 방지
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axios.post(`${backServer}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;

        // 저장 및 axios에 반영
        const memberState = JSON.parse(
          localStorage.getItem("recoil-persist")
        )?.memberState;
        const updatedMember = { ...memberState, accessToken: newAccessToken };

        localStorage.setItem(
          "recoil-persist",
          JSON.stringify({ memberState: updatedMember })
        );

        // 요청에 다시 적용
        originalRequest.headers["Authorization"] = newAccessToken;

        return instance(originalRequest); // 재시도
      } catch (refreshErr) {
        console.error("토큰 재발급 실패:", refreshErr);
        // 로그아웃 처리
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("recoil-persist");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
