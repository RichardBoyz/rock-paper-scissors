import React from "react";
import "./BattleList.scss";
import BattleCard from "./BattleCard";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";

const BattleList = () => {
  const { user } = UserAuth();
  const [battles, setBattles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getBattles = async () => {
    if (!user.auth) return;
    const battleQuery = query(
      collection(db, "battles"),
      where("userIds", "array-contains", user.auth.currentUser.uid)
    );
    try {
      const querySnapshot = await getDocs(battleQuery);
      const newBattles = [];
      querySnapshot.forEach((doc) => {
        newBattles.push({ uid: doc.id, ...doc.data() });
      });
      setBattles((pre) => [...newBattles]);
    } catch (error) {
      console.log(error.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getBattles();
  }, [user.auth]);

  const buildBattleCard = () => {
    if (isLoading) return <p>Loading...</p>;
    if (!battles.length) return <p>沒有對戰</p>;
    console.log(battles);
    return battles.map((battle) => (
      <BattleCard
        key={battle.uid}
        name={battle.name}
        uid={battle.uid}
        isFinished={battle.isFinished}
      />
    ));
  };

  return <div className="battle-list">{buildBattleCard()}</div>;
};

export default BattleList;
