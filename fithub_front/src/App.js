import { Link, Route, Routes } from "react-router-dom";
import Main from "./component/common/Main";
import MyFitMain from "./component/MyFit/MyFitMain";

import CommunityMain from "./component/community/CommunityMain";

function App() {
  return (
    <div className="wrap">
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="myfit" element={<MyFitMain />} />
          <Route path="/community/*" element={<CommunityMain />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
