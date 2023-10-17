import React from "react";
import "./BattleList.scss";
import BattleCard from "./BattleCard";
import { doc, collection } from "firebase/firestore";
import { BattleField } from "../../context/BattleContext";

const BattleList = () => {
  return (
    <div className="battle-list">
      <BattleCard></BattleCard>
    </div>
  );
};

export default BattleList;
