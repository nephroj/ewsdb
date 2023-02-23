import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState, useRecoilValueLoadable } from "recoil";
import { isAuthAtom, navMenuAtom, loadSimSettings } from "../Store";
import { setLogging, LogoutWhen401 } from "../Utils";

function Logout(props) {
  const navigate = useNavigate();
  const setIsAuth = useSetRecoilState(isAuthAtom);
  const setNavMenu = useSetRecoilState(navMenuAtom);

  useEffect(() => {
    setNavMenu("logout");
    setLogging("INFO", "Moved to Logout");
  }, []);

  // function SimSettings() {
  //   const { state, contents } = useRecoilValueLoadable(loadSimSettings);

  //   switch (state) {
  //     case "hasValue":
  //       // return <div>{contents.sim_start_date}</div>;
  //       return <div></div>;
  //     case "loading":
  //       return <div>loading...</div>;
  //     case "hasError":
  //       throw contents;
  //   }
  // }

  // const handleLogout = (e) => {
  //   e.preventDefault();
  //   setLogging("INFO", "Logged Out");

  //   fetch("/api/auth/logout/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Token ${localStorage.getItem("token")}`,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       localStorage.clear();
  //       setIsAuth(false);
  //       navigate("/");
  //     });
  // };

  async function handleLogout(e) {
    e.preventDefault();

    try {
      await setLogging("INFO", "Logged Out");
      const res = await axios({
        method: "post",
        url: "/api/auth/logout/",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      localStorage.clear();
      setIsAuth(false);
      navigate("/");
    } catch (err) {}
  }
  return (
    <div className="container d-flex justify-content-center py-3 ">
      <div className="card col-lg-7 my-5">
        <div className="card-body row justify-content-center">
          <h3 className="text-center my-4">정말 로그아웃 하시겠습니까?</h3>
          <LogoutWhen401 />
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
