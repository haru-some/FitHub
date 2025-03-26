import { Link, Route, Routes } from "react-router-dom";
import Main from "./component/common/Main";
import MyFitMain from "./component/MyFit/MyFitMain";

function App() {
  return (
    <div className="wrap">
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/myfit/*" element={<MyFitMain />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
