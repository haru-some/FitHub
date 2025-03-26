import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const loginIdState = atom({
  key: "loginIdState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});
const memberTypeState = atom({
  key: "memberTypeState",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});
const isLoginState = selector({
  key: "isLoginState",
  get: (state) => {
    const loginId = state.get(loginIdState);
    return loginId !== "";
  },
});

export { loginIdState, memberTypeState, isLoginState };
