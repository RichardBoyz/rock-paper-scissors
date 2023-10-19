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
  onSnapshot,
} from "firebase/firestore";
import BattleMessage from "./BattleMessage";
const VALUE_TO_RPC_STRING = Object.freeze({
  1: "石頭",
  2: "布",
  3: "剪刀",
});

const BattleField = () => {
  const choices = [
    { icon: faHandFist, choiceValue: 1 },
    { icon: faHand, choiceValue: 2 },
    { icon: faHandScissors, choiceValue: 3 },
  ];
  const navigate = useNavigate();
  const [isCreator, setIsCreator] = useState(false);
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [selectHand, setSelectHand] = useState(-1);

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
      const checkIsCreator =
        querySnapshot.docs[0].data().creator === user.auth.currentUser.uid;
      setIsCreator(checkIsCreator);
      setIsLoading(false);
    }
  };
  const [isLoading, setIsLoading] = useState(true);

  const { user } = UserAuth();

  useEffect(() => {
    if (user.auth) {
      checkUserInBattle();

      if (!user.auth.currentUser) return;
      const battleQuery = query(
        collection(db, "battles"),
        where(documentId(), "==", id)
      );
      const unsub = onSnapshot(battleQuery, (snapShot) => {
        const newRounds = [];
        let newRoomName = "";
        snapShot.forEach((element) => {
          newRoomName = element.data().name;
          const rounds = [...element.data().round];
          rounds.forEach((round, index) => {
            newRounds.push({
              round: index + 1,
              ...round,
            });
          });
        });
        setRoomName(newRoomName);
        console.log(newRounds);
        setMessages((pre) => [...newRounds]);
      });
      return () => unsub();
    }
  }, [user.auth]);

  const handleClickBack = () => {
    navigate("/home");
  };

  const handleSelect = (choiceValue) => {
    setSelectHand(choiceValue);
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
          <span className="battle-field__room-name">{roomName}</span>
        </nav>
        <div className="battle-field__content">
          {messages.map((message) => {
            return (
              <BattleMessage
                key={message.round}
                result={message.result}
                round={message.round}
              />
            );
          })}
        </div>
      </div>
      <div className="battle-field__select">
        {isCreator ? <button>結算</button> : null}
        <div className="battle-field__choices">
          {choices.map((choice, index) => {
            return (
              <button
                className="battle-field__choice"
                key={index}
                onClick={() => handleSelect(choice.choiceValue)}
              >
                <FontAwesomeIcon icon={choice.icon} />
              </button>
            );
          })}
        </div>
        {selectHand != -1 ? (
          <p className="battle-field__select-text">{`你選擇了 ${VALUE_TO_RPC_STRING[selectHand]}`}</p>
        ) : null}
        <button>確定</button>
      </div>
    </>
  );
};

export default BattleField;
