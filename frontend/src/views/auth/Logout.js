import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isAuthAtom, navMenuAtom } from "../../Store";
import { setLogging } from "../../Utils";

function Logout(props) {
  const navigate = useNavigate();
  const setIsAuth = useSetRecoilState(isAuthAtom);
  const setNavMenu = useSetRecoilState(navMenuAtom);

  useEffect(() => {
    setNavMenu("logout");
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    setLogging("INFO", "Logged Out");

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
        navigate("/");
      });
  };

  return (
    <div className="container d-flex justify-content-center py-3 ">
      <div className="card col-lg-7 my-5">
        <div className="card-body row justify-content-center">
          <h3 className="text-center my-4">정말 로그아웃 하시겠습니까?</h3>
          <button
            type="button"
            className="btn btn-slategray btn-lg col-8 col-lg-4 my-4"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
