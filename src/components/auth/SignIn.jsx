import React, { useState } from "react";
import "./SignIn.scss";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <form className="sign-in">
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
      </form>
    </>
  );
};

export default SignIn;
