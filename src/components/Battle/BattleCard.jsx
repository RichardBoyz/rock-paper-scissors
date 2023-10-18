import React from "react";
import "./BattleCard.scss";

const BattleCard = ({ name, uid, isFinished }) => {
  return (
    <div className="battle-card">
      <span>{name}</span>
      <span style={{ color: isFinished ? "red" : "blue" }}>
        {isFinished ? "已結束" : "未結束"}
      </span>
    </div>
  );
};

export default BattleCard;
