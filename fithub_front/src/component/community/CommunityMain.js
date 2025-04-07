import { Route, Routes } from "react-router-dom";
import CommunityList from "./CommunityList";
import CommunityView from "./CommunityView";

import CommunityWrite from "./CommunityWrite";
import CommunityUpdate from "./CommunityUpdate";

const CommunityMain = () => {
  return (
    <div className="community-main">
      <Routes>
        <Route path="list" element={<CommunityList />} />
        <Route path="view/:communityNo" element={<CommunityView />} />
        <Route path="write" element={<CommunityWrite />} />
        <Route path="update/:communityNo" element={<CommunityUpdate />} />
      </Routes>
    </div>
  );
};

export default CommunityMain;
