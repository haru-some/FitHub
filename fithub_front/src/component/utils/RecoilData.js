import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

//로그인한 회원 정보 전체
const memberState = atom({
  key: "memberState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

//로그인 여부 확인용
const isLoginState = selector({
  key: "isLoginState",
  get: (state) => {
    const member = state.get(memberState);
    return member !== null;
  },
});

export { memberState, isLoginState };
