import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";

const Simulator = () => {
  const [simStatus, setSimStatus] = useState({});

  useEffect(() => {
    getSimStatus();

    if (parseInt(simStatus.is_active)) {
      const interval = setInterval(() => {
        getSimStatus();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [simStatus.is_active]);

  async function getSimStatus() {
    try {
      const res = await axios({
        method: "get",
        url: "/api/simstatus/",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      const results = res.data;
      let simStatusDb = {};
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        simStatusDb[result.key] = result.value;
      }
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
      // setSimStatus((prevState) => ({
      //   ...prevState,
      //   is_active: "0",
      // }));
    } catch (err) {
      console.log(err.response.data.detail);
    }
  }

  return (
    <div className="container">
      <h1>시뮬레이터</h1>
      <div className="col-lg-6 mx-auto">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th scope="col">변수</th>
              <th scope="col">상태</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">작동 여부</th>
              <td>
                {parseInt(simStatus.is_active) ? (
                  <b className="text-success">● 실행 중</b>
                ) : (
                  <b className="text-danger">● 중지됨</b>
                )}
              </td>
            </tr>

            <tr>
              <th scope="row">실행 시작 시각</th>
              <td>{simStatus.sim_start_time}</td>
            </tr>
            <tr>
              <th scope="row">실행 마지막 시각</th>
              <td>{simStatus.sim_last_time}</td>
            </tr>
            <tr>
              <th scope="row">실행 시간</th>
              <td>{simStatus.sim_duration}분</td>
            </tr>
            <tr>
              <th scope="row">데이터 상 시작 시각</th>
              <td>{simStatus.sim_data_start_time}</td>
            </tr>

            <tr>
              <th scope="row">데이터 상 마지막 시각</th>
              <td>{simStatus.sim_data_last_time}</td>
            </tr>
            <tr>
              <th scope="row">데이터 상 경과 시간</th>
              <td>{simStatus.sim_data_duration}분</td>
            </tr>
            <tr>
              <th scope="row">데이터 1회 생성 시간</th>
              <td>{simStatus.avg_save_time}초</td>
            </tr>
            <tr>
              <th scope="row">실제 실행 속도</th>
              <td>{simStatus.sim_speed}배속</td>
            </tr>
            <tr>
              <th scope="row">생성된 입원정보 행 수</th>
              <td>{simStatus.sim_hosp_n}행</td>
            </tr>
            <tr>
              <th scope="row">생성된 생체징후 행 수</th>
              <td>{simStatus.sim_vital_n}행</td>
            </tr>
            <tr>
              <th scope="row">생성된 검사결과 행 수</th>
              <td>{simStatus.sim_lab_n}행</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-center col-lg-6 mx-auto">
        {parseInt(simStatus.is_active) ? (
          <input
            type="button"
            className="btn btn-slategray btn-lg col-12 col-md-5"
            onClick={onStop}
            value="중지"
          />
        ) : (
          <input
            type="button"
            className="btn btn-seagreen btn-lg col-12 col-md-5"
            onClick={onStart}
            value="시작"
          />
        )}
      </div>
    </div>
  );
};

export default Simulator;
