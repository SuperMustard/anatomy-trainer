import { Routes, Route, Navigate } from "react-router-dom";
import AnatomyReviewer from "./components/AnatomyReviewer/AnatomyReviewer";
import AnatomyEditor from "./components/Editor/AnatomyEditor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/reviewer" />} />
      <Route path="/reviewer" element={<AnatomyReviewer />} />
      <Route path="/editor" element={<AnatomyEditor />} />
    </Routes>
  );
}

export default App;
