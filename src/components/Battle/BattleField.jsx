import { useParams } from "react-router-dom";
import "./BattleField.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHand,
  faHandFist,
  faHandScissors,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const BattleField = () => {
  const choices = [faHandFist, faHand, faHandScissors];

  const { id } = useParams();
  return (
    <>
      <div className="battle-field">
        <nav className="battle-field__nav">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span className="battle-field__room-name">{/* Room name */}</span>
        </nav>
        <div className="battle-field__content"></div>
      </div>
      <div className="battle-field__select">
        <button>結算</button>
        <div className="battle-field__choices">
          {choices.map((choice, index) => {
            return (
              <button className="battle-field__choice" key={index}>
                <FontAwesomeIcon icon={choice} />
              </button>
            );
          })}
        </div>
        <button>確定</button>
      </div>
    </>
  );
};

export default BattleField;
