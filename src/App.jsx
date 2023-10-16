import { Routes, Route } from "react-router-dom";
import "./App.scss";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import { AuthContextProvider } from "./context/AuthContext";

function App() {
  return (
    <div className="app">
      <h1 className="app__title">剪刀 石頭 布</h1>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
