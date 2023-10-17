import React, { useState } from "react";
import "./Invite.scss";

const Invite = () => {
  const [inviteUsers, setInviteUsers] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  return (
    <div className="invite">
      <section className="invite__search">
        <input
          type="text"
          placeholder="輸入使用者信箱"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <button className="invite__search-button">添加使用者</button>
      </section>

      <section className="invite__list">{/* Invited user list */}</section>

      <button>建立對戰</button>
    </div>
  );
};

export default Invite;
