import React, { useState } from "react";
import "./Invite.scss";
import { collection, getDocs, where, query } from "@firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../context/AuthContext";
import Tag from "../common/Tag/Tag";

const Invite = () => {
  const [inviteUsers, setInviteUsers] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const { user } = UserAuth();

  const [invalidMessage, setInvalidMessage] = useState("");

  const handleSearchUser = async () => {
    if (!userEmail) return;
    if (user.auth.currentUser.email === userEmail) {
      setInvalidMessage("你已經是內定人員");
      console.log("已經是內定人員");
      return;
    }
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("email", "==", userEmail));
    const docSnap = await getDocs(userQuery);
    if (docSnap.size > 0) {
      const userDoc = docSnap.docs[0];
      console.log(userDoc.id, " => ", userDoc.data());
      const { displayName, email, uid } = userDoc.data();
      setInviteUsers((pre) => {
        return [...inviteUsers, { displayName, email, uid }];
      });
    } else {
      setInvalidMessage("找不到此使用者");
      console.log("找不到此使用者");
    }
  };

  const removeUserFromInvitedList = (userId) => {};
  return (
    <div className="invite">
      <section className="invite__search">
        <input
          type="text"
          placeholder="輸入使用者信箱"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <button className="invite__search-button" onClick={handleSearchUser}>
          添加使用者
        </button>
      </section>

      <section className="invite__list">
        {inviteUsers.map((userInfo) => (
          <Tag
            key={userInfo.uid}
            label={userInfo.displayName}
            dismissTag={() => removeUserFromInvitedList(userInfo.uid)}
          />
        ))}
      </section>

      <button>建立對戰</button>
    </div>
  );
};

export default Invite;
