import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      console.log("已登出");
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div className="home">
      <p>使用者: {user && user.displayName}</p>
      <button onClick={handleLogout}>登出</button>
    </div>
  );
};

export default Home;
