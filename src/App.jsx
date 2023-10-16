import { Routes, Route } from "react-router-dom";
import "./App.scss";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";

function App() {
  return (
    <div className="app">
      <h1 className="app__title">剪刀 石頭 布</h1>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
