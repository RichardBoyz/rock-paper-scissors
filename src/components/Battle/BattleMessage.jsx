import React from "react";
import "./BattleMessage.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHand,
  faHandFist,
  faHandScissors,
} from "@fortawesome/free-solid-svg-icons";

const ICON_PAIR = Object.freeze({
  1: faHandFist,
  2: faHand,
  3: faHandScissors,
});

const BattleMessage = ({
  round,
  finishedUsers,
  unfinishedUser,
  isFinished,
}) => {
  const displayFinishUser = () => {
    if (finishedUsers.length === 0) return null;
    return (
      <div className="battle-message__name-list">
        <span className="battle-message__name-title">已經選擇</span>
        {finishedUsers.map((user, index) => {
          return (
            <span className="battle-message__name" key={user.id}>
              {user.name}
            </span>
          );
        })}
      </div>
    );
  };

  const displayUnfinishField = () => {
    if (unfinishedUser.length === 0) return null;
    return (
      <div className="battle-message__name-list">
        <span className="battle-message__name-title">尚未選擇</span>
        {unfinishedUser.map((user, index) => {
          return (
            <span className="battle-message__name" key={user.id}>
              {user.name}
            </span>
          );
        })}
      </div>
    );
  };

  const choiceField = (resultDict) => {
    return;
  };

  const displayResult = () => {
    if (!isFinished) return null;
    const rockUser = [];
    const paperUser = [];
    const scissorsUser = [];

    finishedUsers.forEach((user) => {
      if (user.result === 1) {
        rockUser.push(user);
      }
      if (user.result === 2) {
        paperUser.push(user);
      }
      if (user.result === 3) {
        scissorsUser.push(user);
      }
    });

    const resultDict = {
      1: rockUser,
      2: paperUser,
      3: scissorsUser,
    };
    console.log(Object.keys(resultDict));
    return (
      <div className="battle-message__result">
        {Object.keys(resultDict).map((resultDictKey) => {
          return (
            resultDict[resultDictKey].length !== 0 && (
              <div className="battle-message__choice" key={resultDictKey}>
                <div className="battle-message__choice-icon">
                  <FontAwesomeIcon icon={ICON_PAIR[resultDictKey]} />
                </div>
                <div className="battle-message__choice-name-list">
                  {resultDict[resultDictKey].map((user) => {
                    console.log(user);
                    return <span key={user.id}>{user.name}</span>;
                  })}
                </div>
              </div>
            )
          );
        })}
        {/* <div className="battle-message__choice">
          <div className="battle-message__choice-icon">
            <FontAwesomeIcon icon={faHand} />
          </div>
          <span>123</span>
        </div>
        <div className="battle-message__choice">
          <div className="battle-message__choice-icon">
            <FontAwesomeIcon icon={faHandFist} />
          </div>
          <span>123</span>
        </div>
        <div className="battle-message__choice">
          <div className="battle-message__choice-icon">
            <FontAwesomeIcon icon={faHandScissors} />
          </div>
          <span>123</span>
        </div> */}
      </div>
    );
  };

  return (
    <div className="battle-message">
      <span className="battle-message__round">{`第 ${round} 輪`}</span>
      <span className="battle-message__finish">
        {isFinished
          ? "已結算"
          : unfinishedUser.length === 0
          ? "請房間建立者結算"
          : "未結算"}
      </span>
      <div className="battle-message__info">
        {displayUnfinishField()}
        {displayFinishUser()}
      </div>
      {displayResult()}
    </div>
  );
};

export default BattleMessage;
