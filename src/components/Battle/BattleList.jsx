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
import ActionSheet from "../common/ActionSheet/ActionSheet";

const BattleList = () => {
  const { user } = UserAuth();
  const [battles, setBattles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenActionSheet, setIsOpenActionSheet] = useState(false);
  const [resultData, setResultData] = useState({});
  const findBattles = () => {
    if (!user.auth || !user.auth.currentUser) return;
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

  const buildWinAndLoseBoard = () => {
    return (
      <div className="battle-list__result">
        <div className="battle-list__win">
          <div className="battle-list__result-title">優勝者</div>
          {resultData.winnersName?.map((userName, index) => {
            return (
              <div className="battle-list__name" key={index}>
                {userName}
              </div>
            );
          })}
        </div>
        <div className="battle-list__lose">
          <div className="battle-list__result-title">失敗者</div>
          {resultData.losersName?.map((userName, index) => {
            return (
              <div className="battle-list__name" key={index}>
                {userName}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleSeeResult = async (battle) => {
    setIsOpenActionSheet(true);
    const winnerId = battle.round.at(-1).winnerIds[0];
    const loserIds = battle.userIds.filter((userId) => userId !== winnerId);

    const loserQuery = query(
      collection(db, "users"),
      where("uid", "in", loserIds)
    );
    const losersSnap = await getDocs(loserQuery);
    const newLosersName = [];
    losersSnap.forEach((doc) => {
      newLosersName.push(doc.data().displayName);
    });
    const newResultData = {
      winnersName: [battle.winner],
      losersName: [...newLosersName],
    };
    console.log(newResultData);
    setResultData((pre) => {
      return { ...newResultData };
    });
    console.log(battle);
  };

  const buildBattleCard = () => {
    if (isLoading) return <p>Loading...</p>;
    if (!battles.length) return <p>沒有對戰</p>;
    return battles.map((battle) => (
      <BattleCard
        key={battle.uid}
        name={battle.name}
        uid={battle.uid}
        isFinished={battle.isFinished}
        handleSeeResult={() => handleSeeResult(battle)}
      />
    ));
  };

  return (
    <>
      <div className="battle-list">{buildBattleCard()}</div>

      {isOpenActionSheet && (
        <ActionSheet closeAction={() => setIsOpenActionSheet(false)}>
          {buildWinAndLoseBoard()}
        </ActionSheet>
      )}
    </>
  );
};

export default BattleList;
