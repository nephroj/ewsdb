import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isAuthAtom } from "../../Store";

function Logout(props) {
  const navigate = useNavigate();
  const setIsAuth = useSetRecoilState(isAuthAtom);

  // useEffect(() => {
  //   if (localStorage.getItem("token") !== null) {
  //     setIsAuth(true);
  //   } else {
  //     setIsAuth(false);
  //   }
  // }, []);

  const handleLogout = (e) => {
    e.preventDefault();

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
      <div className="card col-lg-5 my-5">
        <div className="card-header">
          <b>확인 메세지</b>
        </div>
        <div className="card-body row justify-content-center">
          <h3 className="text-center my-4">정말 로그아웃 하시겠습니까?</h3>
          <button
            type="button"
            className="btn btn-slategray btn-lg col-8 col-lg-6 my-4"
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
