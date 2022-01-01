import React from "react";
import { Link } from "react-router-dom";

function HomeUI() {
  return (
    <div className="container">
      <h1>홈 화면</h1>
      <Link to="/simulator">시뮬레이터로 이동</Link>
    </div>
  );
}

export default HomeUI;
