import React, { useState } from "react";
import { auth } from "../../firebase";
import "./SignUp.scss";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [error, setError] = useState("");

  const { createUser } = UserAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUser(email, password, displayName);
      navigate("/home");
    } catch (e) {
      setError(e.message);
      console.log(e.message);
    }
  };

  return (
    <>
      <form className="sign-up" onSubmit={handleSubmit}>
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
