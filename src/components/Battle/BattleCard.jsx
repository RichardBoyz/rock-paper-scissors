import React from "react";
import "./BattleCard.scss";
import { useNavigate } from "react-router-dom";

const BattleCard = ({ name, uid, isFinished, handleSeeResult }) => {
  const navigate = useNavigate();

  const toBattleField = () => {
    if (!uid) {
      console.log("Invlid uid!");
      return;
    }
    navigate({
      pathname: `/battle/${uid}`,
    });
  };

  return (
    <div className="battle-card">
      <span>{name}</span>
      {isFinished && <button onClick={handleSeeResult}>看結果</button>}
      <span
        className="battle-card__status"
        style={{ color: isFinished ? "red" : "blue" }}
      >
        {isFinished ? "已結束" : "未結束"}
      </span>
      {!isFinished && <button onClick={toBattleField}>進入對戰</button>}
    </div>
  );
};

export default BattleCard;
