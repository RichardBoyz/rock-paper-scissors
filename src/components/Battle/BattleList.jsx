import React, { useEffect, useState } from "react";
import "./BattleList.scss";
import BattleCard from "./BattleCard";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";

const BattleList = () => {
  const { user } = UserAuth();
  const [battles, setBattles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const findBattles = () => {
    if (!user.auth) return;
    setIsLoading(true);
    const battleQuery = query(
      collection(db, "battles"),
      where("userIds", "array-contains", user.auth.currentUser.uid)
    );
    const unsub = onSnapshot(battleQuery, (snapShot) => {
      const newBattles = [];
      snapShot.forEach((element) => {
        newBattles.push({ uid: element.id, ...element.data() });
      });
      setBattles([...newBattles]);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    findBattles();
    return () => {
      findBattles();
    };
  }, [user.auth]);

  const buildBattleCard = () => {
    if (isLoading) return <p>Loading...</p>;
    if (!battles.length) return <p>沒有對戰</p>;
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
