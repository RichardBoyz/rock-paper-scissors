import { useNavigate, useParams } from "react-router-dom";
import "./BattleField.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHand,
  faHandFist,
  faHandScissors,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { UserAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  getDocs,
  collection,
  query,
  where,
  documentId,
} from "firebase/firestore";

const BattleField = () => {
  const choices = [faHandFist, faHand, faHandScissors];
  const navigate = useNavigate();

  const checkUserInBattle = async () => {
    const checkQuery = query(
      collection(db, "battles"),
      where(documentId(), "==", id),
      where("userIds", "array-contains", user.auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(checkQuery);
    if (querySnapshot.empty) {
      navigate("/home");
    } else {
      setIsLoading(false);
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  const { user } = UserAuth();

  useEffect(() => {
    if (user.auth) {
      checkUserInBattle();
    }
  }, [user.auth]);

  const handleClickBack = () => {
    navigate("/home");
  };

  const { id } = useParams();
  return isLoading ? (
    <div>Loading</div>
  ) : (
    <>
      <div className="battle-field">
        <nav className="battle-field__nav">
          <FontAwesomeIcon
            icon={faArrowLeft}
            onClick={handleClickBack}
            className="battle-field__back"
          />
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
