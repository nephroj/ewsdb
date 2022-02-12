import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useIdleTimer } from "react-idle-timer";
import { useRecoilState } from "recoil";

import "./App.css";
import { isAuthAtom } from "./Store";
import Navbar from "./components/Navbar";

import HomeUI from "./components/HomeUI";
import Logout from "./views/auth/Logout";
import Login from "./views/auth/Login";
import Simulator from "./views/app/Simulator";
import Instruction from "./views/app/Instruction";
import ServerInfo from "./views/app/ServerInfo";

function App() {
  const [isAuth, setIsAuth] = useRecoilState(isAuthAtom);

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, []);

  // 특정시간동안 활동이 없으면 logout 시행
  const handleOnIdle = (event) => {
    if (isAuth) {
      fetch("/api/auth/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.clear();
          setIsAuth(false);
          window.location.replace("/");
        });
      const logoutTime = new Date(getLastActiveTime());
      console.log("Last active time:", logoutTime);
    }
  };
  const { getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 20,
    onIdle: handleOnIdle,
    debounce: 500,
  });

  return (
    <div>
      <div>
        <Navbar />
        <Routes>
          {localStorage.getItem("token") !== null ? (
            <Route path="/">
              <Route index element={<HomeUI />} />
              <Route path="instruction/*" element={<Instruction />} />
              <Route path="simulator" element={<Simulator />} />
              <Route path="serverinfo" element={<ServerInfo />} />
              <Route path="logout" element={<Logout />} />
            </Route>
          ) : (
            <Route path="*" element={<Login />} />
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
