import React from "react";
import "./BattleMessage.scss";

const BattleMessage = ({ round, finishedUsers, unfinishedUser, result }) => {
  return (
    <div className="battle-message">
      <span>{`第 ${round} 輪`}</span>
      <span>{result ?? "未結算"}</span>
    </div>
  );
};

export default BattleMessage;
