import React, { useState } from "react";
import "./SignIn.scss";
import { Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { signIn } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate("/home");
    } catch (e) {
      setError(e.message);
      console.log(e.message);
    }
  };

  return (
    <>
      <form className="sign-in" onSubmit={handleSubmit}>
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

        <p>
          還沒有帳號? <Link to="/signup">我要註冊</Link>{" "}
        </p>

        <button type="submit">登入</button>
      </form>
    </>
  );
};

export default SignIn;
