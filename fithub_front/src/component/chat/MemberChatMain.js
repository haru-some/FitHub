import { Route, Routes } from "react-router-dom";
import MemberChatList from "./MemberChatList";

const MemberChatMain = () => {
  return (
    <div>
      <Routes>
        <Route path="list" element={<MemberChatList />} />
      </Routes>
    </div>
  );
};

export default MemberChatMain;
