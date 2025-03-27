import { Route, Routes } from "react-router-dom";
import CommunityList from "./CommunityList";
import CommunityView from "./CommunityView";
import CommunitySearch from "./CommunitySearch";
import CommunityWrite from "./CommunityWrite";

const CommunityMain = () => {
  return (
    <div className="community-main">
      <Routes>
        <Route path="list" element={<CommunityList />} />
        <Route path="view" element={<CommunityView />} />
        <Route path="search" element={<CommunitySearch />} />
        <Route path="write" element={<CommunityWrite />} />
      </Routes>
    </div>
  );
};

export default CommunityMain;
