import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isAuthAtom } from "../Store";

import logo from "../logo.svg";

function Navbar() {
  const isAuth = useRecoilValue(isAuthAtom);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  return (
    <React.Fragment>
      {isAuth && (
        <nav className="navbar navbar-expand-md navbar-dark sticky-top bg-dark">
          <div className="container">
            <Link to="/" className="nav-link">
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
                  <Link to="/instruction" className="nav-link">
                    설명서
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/simulator" className="nav-link">
                    시뮬레이터
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/logout" className="nav-link">
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
