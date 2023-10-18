import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Home.scss";
import BattleList from "./Battle/BattleList";
import Invite from "./Invite/Invite";
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
          <div className="home__display-name">
            <span>使用者: {user && user.displayName}</span>
          </div>

          <Invite />
        </div>
        <div className="home__right">
          <BattleList />
        </div>
      </section>
    </div>
  );
};

export default Home;
