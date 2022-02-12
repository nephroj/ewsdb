import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isAuthAtom } from "../../Store";
import { setLogging } from "../../Utils";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [isAuth, setIsAuth] = useRecoilState(isAuthAtom);

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios({
        method: "post",
        url: "/api/auth/login/",
        data: {
          username: username,
          password: password,
        },
      });
      localStorage.clear();
      localStorage.setItem("token", res.data.key);
      setIsAuth(true);
      setLogging("INFO", "Logged In");
      navigate("/");
    } catch (err) {
      setUsername("");
      setPassword("");
      localStorage.clear();
      setIsAuth(false);
      // Error message 처리: err.response.data.non_field_errors
      const error_message = Object.values(err.response.data)[0];
      if (error_message) {
        setErrors(error_message);
      }
    }
  }

  return (
    <div className="container">
      {!isAuth && (
        <div className="row align-items-center mx-1 my-5 height70">
          <div className="col-md-9 col-lg-7 col-xl-5 mx-auto">
            <div className="card back-shadow">
              <div className="card-header">
                <h1 align="center">EWS Simulator</h1>
              </div>

              <div className="card-body">
                <form onSubmit={onSubmit}>
                  <div className="mx-4 mt-5">
                    <label className="form-label" htmlFor="username">
                      아이디
                    </label>
                    <input
                      className="form-control"
                      name="username"
                      type="username"
                      value={username}
                      required
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="my-4 mx-4">
                    <label className="form-label" htmlFor="password">
                      비밀번호
                    </label>{" "}
                    <br />
                    <input
                      className="form-control"
                      name="password"
                      type="password"
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {errors && (
                    <div className="login-content text-center">
                      <p className="text-danger">
                        <b>[실패]</b> {errors}
                      </p>
                    </div>
                  )}
                  <div className="d-grid col-10 col-lg-6 my-5 mx-auto">
                    <input
                      className="btn btn-steelblue"
                      type="submit"
                      value="로그인"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
