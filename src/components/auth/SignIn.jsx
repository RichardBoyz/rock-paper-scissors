import React, { useState } from "react";
import { auth } from "../../firebase";
import "./SignIn.scss";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <form className="sign-in" onSubmit={signIn}>
        <h1>登入</h1>

        <section className="sign-in__email">
          <h2>信箱</h2>
          <input
            type="email"
            placeholder="請輸入信箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </section>

        <section className="sign-in__password">
          <h2>密碼</h2>
          <input
            type="password"
            placeholder="請輸入密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </section>

        <button type="submit">登入</button>
      </form>
    </>
  );
};

export default SignIn;
