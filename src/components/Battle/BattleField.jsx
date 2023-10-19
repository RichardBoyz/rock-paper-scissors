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
import { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import {
  getDocs,
  collection,
  query,
  where,
  documentId,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import BattleMessage from "./BattleMessage";
const VALUE_TO_RPC_STRING = Object.freeze({
  1: "石頭",
  2: "布",
  3: "剪刀",
});

const WIN_PAIR = Object.freeze({
  1: 3,
  2: 1,
  3: 2,
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
  const [canSelect, setCanSelect] = useState(false);
  const [selectHand, setSelectHand] = useState(-1);
  const [canFinishRound, setCanFinishRound] = useState(false);
  const [latestRounds, setLatestRounds] = useState([]);
  const [players, setPlayers] = useState([]);
  const [isBattleFinish, setIsBattleFinish] = useState(false);
  const [winnerName, setWinnerName] = useState([]);
  const [userNameDict, setUserNameDict] = useState({});

  useEffect(() => {
    getWinnerName();
  }, [isBattleFinish]);

  const getWinnerName = async () => {
    const battleRef = doc(db, "battles", id);
    const battleSnapshot = await getDoc(battleRef);
    setWinnerName((pre) => [...battleSnapshot.data().winner]);
  };

  const checkUserInBattle = async () => {
    const checkQuery = query(
      collection(db, "battles"),
      where(documentId(), "==", id),
      where("userIds", "array-contains", user.auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(checkQuery);
    if (querySnapshot.empty) {
      navigate("/home");
      return;
    }
    const checkIsCreator =
      querySnapshot.docs[0].data().creator === user.auth.currentUser.uid;
    setIsCreator(checkIsCreator);
    setIsLoading(false);
    const userIds = querySnapshot.docs[0].data().userIds;
    await getUserNameDict(userIds);
  };
  const [isLoading, setIsLoading] = useState(true);

  const { user } = UserAuth();

  const getUserNameDict = async (userIds) => {
    const userQuery = query(
      collection(db, "users"),
      where("uid", "in", userIds)
    );
    const userListSnapshot = await getDocs(userQuery);
    if (userListSnapshot.empty) {
      console.log("empty");
    } else {
      const newUserInfo = {};
      userListSnapshot.docs.forEach((user) => {
        const userData = user.data();
        newUserInfo[userData.uid] = userData.displayName;
      });
      setUserNameDict((pre) => newUserInfo);
    }
  };

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
        let newPlayers = [];
        let newIsFinished = false;

        snapShot.forEach((element) => {
          newRoomName = element.data().name;
          newPlayers =
            element.data().round.length == 1
              ? element.data().userIds
              : element.data().round[element.data().round.length - 2].winnerIds;
          newIsFinished = element.data().isFinished;
          const rounds = [...element.data().round];
          rounds.forEach((round, index) => {
            newRounds.push({
              round: index + 1,
              ...round,
            });
          });
        });
        if (newIsFinished) setIsBattleFinish((pre) => true);
        setPlayers((pre) => [...newPlayers]);

        setRoomName(newRoomName);
        const latestRoundUserResult = newRounds.at(-1).usersResult;

        setLatestRounds((pre) => [...newRounds]);

        let unSelectedUserCount = 0;
        for (const result in latestRoundUserResult) {
          if (latestRoundUserResult[result] === 0) unSelectedUserCount += 1;
        }
        if (unSelectedUserCount !== 0) setCanFinishRound((pre) => false);
        else setCanFinishRound((pre) => true);

        if (
          latestRoundUserResult[user.auth.currentUser.uid] === undefined ||
          latestRoundUserResult[user.auth.currentUser.uid] != 0
        ) {
          setCanSelect((pre) => false);
        } else {
          setCanSelect((pre) => true);
        }
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

  const handleConfirmChoice = async () => {
    if (selectHand == -1) return;
    setCanSelect((pre) => false);
    const latestRound = latestRounds.at(-1);
    latestRound.usersResult[user.auth.currentUser.uid] = selectHand;
    const docRef = doc(db, "battles", id);
    const setData = { round: latestRounds };
    try {
      await updateDoc(docRef, setData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const setWinAndLose = (result) => {
    const listResult = Array.from(result);
    if (WIN_PAIR[listResult[0]] === listResult[1]) {
      return { winer: listResult[0], loser: listResult[1] };
    }
    return { winer: listResult[1], loser: listResult[0] };
  };

  const finishRound = async () => {
    const latestRound = latestRounds.at(-1);
    latestRound.isFinished = true;
    const latestResult = latestRound.usersResult;
    const choiceValueSet = new Set(Object.values(latestResult));
    let newWinnerIds = [],
      newLoserIds = [];
    if (choiceValueSet.size !== 2) {
      latestRound.isFinished = true;
      latestRound.winnerIds = players;

      const newRound = {
        isFinished: false,
        winnerIds: [],
        loserIds: [],
      };
      const usersResultDict = {};
      players.forEach((id) => {
        usersResultDict[id] = 0;
      });
      newRound.usersResult = usersResultDict;
      latestRounds.push(newRound);
    } else {
      let winAndLoseDict = setWinAndLose(choiceValueSet);
      for (const userId in latestResult) {
        if (latestResult[userId] === winAndLoseDict.winer) {
          newWinnerIds.push(userId);
        } else {
          newLoserIds.push(userId);
        }
      }
      latestRound.winnerIds = newWinnerIds;
      latestRound.loserIds = newLoserIds;

      if (newWinnerIds.length !== 1) {
        const newRound = {
          isFinished: false,
          winnerIds: [],
          loserIds: [],
        };
        const usersResultDict = {};
        newWinnerIds.forEach((id) => {
          usersResultDict[id] = 0;
        });
        newRound.usersResult = usersResultDict;
        latestRounds.push(newRound);
      }
    }

    const docRef = doc(db, "battles", id);
    const setData = { round: latestRounds };
    try {
      await updateDoc(docRef, setData);
    } catch (error) {
      console.log(error.message);
    }
    if (newWinnerIds.length === 1) {
      finishWholeBattle(newWinnerIds);
    }
  };
  const finishWholeBattle = async (winnerIds) => {
    const docRef = doc(db, "battles", id);
    const setData = { isFinished: true, winner: winnerIds };
    try {
      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, where("uid", "in", winnerIds));
      const winners = await getDocs(userQuery);
      console.log(winners);
      const newWinnerNames = [];
      winners.forEach((doc) => {
        newWinnerNames.push(doc.data().displayName);
      });
      setData.winner = newWinnerNames;
      await updateDoc(docRef, setData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const extractUnFinishedUser = (userResult) => {
    if (Object.keys(userNameDict).length !== 0) {
      const userNameList = [];
      for (const userKey in userResult) {
        if (userResult[userKey] === 0) {
          userNameList.push({ id: userKey, name: userNameDict[userKey] });
        }
      }
      return userNameList;
    }
    return [];
  };
  const extractFinishedUser = (userResult) => {
    if (Object.keys(userNameDict).length !== 0) {
      const userNameList = [];
      for (const userKey in userResult) {
        if (userResult[userKey] !== 0) {
          userNameList.push({
            id: userKey,
            name: userNameDict[userKey],
            result: userResult[userKey],
          });
        }
      }
      return userNameList;
    }
    return [];
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
                isFinished={message.isFinished}
                round={message.round}
                unfinishedUser={extractUnFinishedUser(message.usersResult)}
                finishedUsers={extractFinishedUser(message.usersResult)}
              />
            );
          })}
        </div>
      </div>
      {isBattleFinish ? (
        <div className="battle-field__finish">
          <p className="battle-field__select-text">對戰結束</p>
          <span>贏家是</span>
          {winnerName.map((userDisplayName, index) => {
            return <div key={index}>{userDisplayName}</div>;
          })}
        </div>
      ) : (
        <div className="battle-field__select">
          {isCreator && canFinishRound ? (
            <button onClick={finishRound}>結算</button>
          ) : null}
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

          <button disabled={!canSelect} onClick={handleConfirmChoice}>
            確定
          </button>
        </div>
      )}
    </>
  );
};

export default BattleField;
