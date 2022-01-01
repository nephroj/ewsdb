import React, { useEffect, useState } from "react";
import axios from "axios";

const Simulator = () => {
  const [simStatus, setSimStatus] = useState({
    time_last: null,
    is_active: 0,
  });

  useEffect(() => {
    getSimStatus();
    // const interval = setInterval(() => {
    //   getSimStatus();
    // }, 3000);

    // return () => clearInterval(interval);
  }, []);

  async function getSimStatus() {
    try {
      const res = await axios({
        method: "get",
        url: "/api/simstatus/",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      const results = res.data.results;
      let simStatusDb = {};
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        simStatusDb[result.key] = result.value;
      }
      console.log(simStatusDb);
      setSimStatus(simStatusDb);
    } catch (err) {
      console.log(err.response.data.detail);
    }
  }

  async function onStart(e) {
    e.preventDefault();
    try {
      const res = await axios({
        method: "post",
        url: "/api/simulator/",
        data: {
          operation: "start",
          speed: 900,
          from_prev: 1,
        },
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      console.log(res.data);
      setSimStatus((prevState) => ({
        ...prevState,
        is_active: "1",
      }));
    } catch (err) {
      console.log(err.response.data.detail);
    }
  }

  async function onStop(e) {
    e.preventDefault();
    try {
      const res = await axios({
        method: "post",
        url: "/api/simulator/",
        data: {
          operation: "stop",
        },
      });
      console.log(res.data);
      setSimStatus((prevState) => ({
        ...prevState,
        is_active: "0",
      }));
    } catch (err) {
      console.log(err.response.data.detail);
    }
  }

  return (
    <div className="container">
      <h1>시뮬레이터</h1>
      <p>작동 상태: {parseInt(simStatus.is_active) ? "작동 중" : "중지됨"}</p>
      <p>마지막 데이터 시각: {simStatus.time_last}</p>
      <div className="d-flex justify-content-center">
        <input
          type="button"
          className="btn btn-seagreen col-5 col-lg-3"
          onClick={onStart}
          value="Start"
          disabled={parseInt(simStatus.is_active)}
        />
        &emsp;
        <button
          type="button"
          className="btn btn-slategray col-5 col-lg-3"
          onClick={onStop}
          disabled={!parseInt(simStatus.is_active)}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default Simulator;
