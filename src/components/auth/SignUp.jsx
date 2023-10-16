import React, { useState } from "react";
import { auth } from "../../firebase";
import "./SignUp.scss";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link } from "react-router-dom";
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateCurrentUserDisplayName(userCredential.user.auth);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateCurrentUserDisplayName = (auth) => {
    updateProfile(auth.currentUser, {
      displayName: displayName,
    })
      .then(() => {
        console.log("暱稱更新成功");
      })
      .catch((error) => {
        console.log("暱稱更新失敗");
      });
  };

  return (
    <>
      <form className="sign-up" onSubmit={signUp}>
        <h1>註冊</h1>

        <section className="sign-up__email">
          <h2>信箱 *</h2>
          <input
            type="email"
            placeholder="請輸入信箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </section>

        <section className="sign-up__password">
          <h2>密碼 *</h2>
          <input
            type="password"
            placeholder="請輸入密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </section>

        <section className="sign-up__display-name">
          <h2>暱稱 *</h2>
          <input
            type="text"
            placeholder="請輸入暱稱"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </section>

        <p>
          已經有帳號? <Link to="/">前往登入</Link>{" "}
        </p>

        <button type="submit">註冊</button>
      </form>
    </>
  );
};

export default SignUp;
