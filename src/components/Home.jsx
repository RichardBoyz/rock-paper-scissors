import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Home.scss";
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
      <button onClick={handleLogout}>登出</button>

      <section className="home__container">
        <div className="home__left">
          <p>使用者: {user && user.displayName}</p>
        </div>
        <div className="home__right">{/* Battle list */}</div>
      </section>
    </div>
  );
};

export default Home;
