import { Route, Routes } from "react-router-dom";
import CommunityList from "./CommunityList";
import CommunityView from "./CommunityView";
import CommunitySearch from "./CommunitySearch";
import CommunityWrite from "./CommunityWrite";
import MyCommunityList from "./MyCommunityList";

const CommunityMain = () => {
  return (
    <div className="community-main">
      <Routes>
        <Route path="list" element={<CommunityList />} />
        <Route path="view" element={<CommunityView />} />
        <Route path="search" element={<CommunitySearch />} />
        <Route path="write" element={<CommunityWrite />} />
        <Route path="mycommunity" element={<MyCommunityList />} />
      </Routes>
    </div>
  );
};

export default CommunityMain;
