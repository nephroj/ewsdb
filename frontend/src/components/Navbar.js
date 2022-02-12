import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isAuthAtom } from "../Store";

import logo from "../logo.svg";

function Navbar() {
  const isAuth = useRecoilValue(isAuthAtom);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("");
  const [menu, setMenu] = useState("");

  useEffect(() => {
    getUrl();
    getCurrentURL();
  }, [currentUrl]);

  function getUrl() {
    const url = window.location.href;
    setCurrentUrl(url);
  }

  function getCurrentURL() {
    if (currentUrl) {
      if (currentUrl.includes("instruction")) {
        setMenu("instruction");
      } else if (currentUrl.includes("simulator")) {
        setMenu("simulator");
      } else if (currentUrl.includes("serverinfo")) {
        setMenu("serverinfo");
      } else if (currentUrl.includes("logout")) {
        setMenu("logout");
      } else {
        setMenu("");
      }
    }
  }

  return (
    <React.Fragment>
      {isAuth && (
        <nav className="navbar navbar-expand-md navbar-dark sticky-top bg-dark">
          <div className="container" onClick={getUrl}>
            <Link
              to="/"
              className="nav-link"
              onClick={() => setIsNavCollapsed(true)}
            >
              <div className="navbar-brand">
                <img
                  src={logo}
                  width="35"
                  height="35"
                  className="App-logo d-inline-block align-center"
                  alt=""
                />
                EWS Simulator
              </div>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded={!isNavCollapsed ? true : false}
              aria-label="Toggle navigation"
              onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}
              id="navbarNav"
            >
              <ul className="navbar-nav">
                {/* <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </li> */}
                <li className="nav-item">
                  <Link
                    to="/instruction/1"
                    className={`nav-link ${menu === "instruction" && "active"}`}
                  >
                    설명서
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/simulator"
                    className={`nav-link ${menu === "simulator" && "active"}`}
                  >
                    시뮬레이터
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/serverinfo"
                    className={`nav-link ${menu === "serverinfo" && "active"}`}
                  >
                    서버모니터링
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/logout"
                    className={`nav-link ${menu === "logout" && "active"}`}
                  >
                    로그아웃
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}
    </React.Fragment>
  );
}

export default Navbar;
