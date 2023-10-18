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
  const [canListen, setCanListen] = useState(false);
  const findBattles = () => {
    if (!user.auth) return;
    setIsLoading(true);
    const battleQuery = query(
      collection(db, "battles"),
      where("userIds", "array-contains", user.auth.currentUser.uid)
    );
    const unsub = onSnapshot(battleQuery, (snapShot) => {
      if (snapShot.docChanges().length) {
        const battleDataDict = {};
        battles.forEach((battle, index) => {
          battleDataDict[battle.uid] = index;
        });
        const newBattles = [...battles];
        console.log(newBattles);
        snapShot.docChanges().forEach((change) => {
          if (battleDataDict[change.doc.id] != undefined) {
            newBattles[battleDataDict[change.doc.id]] = {
              ...newBattles[battleDataDict[change.doc.id]],
              ...change.doc.data(),
            };
          } else {
            newBattles.push({ uid: change.doc.id, ...change.doc.data() });
          }
        });
        setBattles((pre) => [...newBattles]);
      }
      setIsLoading(false);
    });
  };

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
      setCanListen(true);
    } catch (error) {
      console.log(error.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    findBattles();
    return () => {
      findBattles();
    };
  }, [canListen]);

  useEffect(() => {
    getBattles();
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
