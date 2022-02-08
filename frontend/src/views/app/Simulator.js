import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { timeFormatting } from "../../Store";

function Simulator() {
  const [simStatus, setSimStatus] = useState({});
  const [simLoading, setSimLoading] = useState(false);
  const initialSimSpeed = 100;
  const initialSpeedSetting = {
    maxSpeed: 400,
    speedAdjust: 3,
  };
  const [simSpeed, setSimSpeed] = useState(initialSimSpeed);
  const [speedSet, setSpeedSet] = useState(initialSpeedSetting);
  const [speedTemp, setSpeedTemp] = useState(initialSpeedSetting);
  const [speedSetOpen, setSpeedSetOpen] = useState(false);

  useEffect(() => {
    getSimStatus();

    if (simStatus.is_active) {
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
      setSimStatus(results);
    } catch (err) {
      console.log(err.response.data.detail);
    }
  }

  async function onStart(e) {
    e.preventDefault();
    setSimLoading(true);
    const simSpeedSetting = simSpeed * speedSet.speedAdjust;
    try {
      const res = await axios({
        method: "post",
        url: "/api/simulator/",
        data: {
          operation: "start",
          speed: simSpeedSetting,
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
      setTimeout(() => setSimLoading(false), 3000);
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
    } catch (err) {
      console.log(err.response.data.detail);
    }
  }

  function onSpeedSetChange(e) {
    e.preventDefault();
    let key = e.target.id;
    let value = e.target.value;

    setSpeedTemp((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }

  return (
    <div className="container py-3">
      <div className="row">
        <div className="card col-11 col-lg-6 my-5 py-2 mx-auto">
          <div className="card-body text-center">
            {simStatus.is_active ? (
              <h2>
                시뮬레이터 <b className="text-success">● 실행 중</b>
              </h2>
            ) : (
              <h2>
                시뮬레이터 <b className="text-danger">● 중지 상태</b>
              </h2>
            )}
          </div>
        </div>
      </div>
      <div className="row mt-4 d-flex justify-content-center">
        <div className="col-lg-4 mx-4 px-4 py-4">
          <label htmlFor="Range400" className="form-label">
            <b>데이터 진행 속도:</b> 약 {simSpeed}배속{" "}
            <span
              type="button"
              className="badge bg-secondary"
              onClick={() => {
                setSpeedSetOpen(!speedSetOpen);
                setSpeedTemp(speedSet);
              }}
            >
              {speedSetOpen ? "설정 닫기" : "설정 열기"}
            </span>
          </label>
          {speedSetOpen && (
            <div className="card mb-3">
              <div className="card-body">
                <form className="g-3">
                  <div className="mb-2 row">
                    <label className="col-5 col-form-label">최대 속도</label>
                    <div className="col-7">
                      <input
                        type="text"
                        className="form-control"
                        id="maxSpeed"
                        value={speedTemp.maxSpeed}
                        onChange={onSpeedSetChange}
                      />
                    </div>
                  </div>
                  <div className="mb-2 row">
                    <label className="col-5 col-form-label">속도 조정값</label>
                    <div className="col-7">
                      <input
                        type="text"
                        className="form-control"
                        id="speedAdjust"
                        value={speedTemp.speedAdjust}
                        onChange={onSpeedSetChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      type="button"
                      className="btn btn-steelblue mx-2"
                      onClick={() => {
                        setSpeedSet(speedTemp);
                        if (parseInt(simSpeed) > parseInt(speedTemp.maxSpeed)) {
                          setSimSpeed(speedTemp.maxSpeed);
                        }
                      }}
                    >
                      수정하기
                    </button>
                    <button
                      type="button"
                      className="btn btn-slategray"
                      onClick={() => {
                        setSimSpeed(initialSimSpeed);
                        setSpeedTemp(initialSpeedSetting);
                        setSpeedSet(initialSpeedSetting);
                      }}
                    >
                      초기화
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <input
            type="range"
            className="form-range"
            min="1"
            max={speedSet.maxSpeed}
            step="1"
            id="Range400"
            value={simSpeed}
            onChange={(e) => setSimSpeed(e.target.value)}
            disabled={simStatus.is_active}
          />
          <div className="row">
            <div className="col-6 text-left">
              <small> ×1</small>
            </div>
            <div className="col-6 text-right">
              <small>×{speedSet.maxSpeed}</small>
            </div>
          </div>
          <div className="d-flex justify-content-center mx-auto mt-5">
            {simStatus.is_active ? (
              <input
                type="button"
                className="btn btn-slategray btn-lg col-12 col-md-8"
                onClick={(e) => {
                  if (window.confirm("시뮬레이션을 중단하시겠습니까?"))
                    onStop(e);
                }}
                value="중지"
              />
            ) : (
              <input
                type="button"
                className="btn btn-seagreen btn-lg col-12 col-md-8"
                onClick={(e) => {
                  if (window.confirm("시뮬레이션을 시작하시겠습니까?"))
                    onStart(e);
                }}
                value="시작"
              />
            )}
          </div>
        </div>
        <div className="col-lg-6">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">변수</th>
                <th scope="col">상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">실행 시작 시각</th>
                <td>{!simLoading && simStatus.sim_start_time}</td>
              </tr>
              <tr>
                <th scope="row">실행 마지막 시각</th>
                <td>{simStatus.sim_last_time}</td>
              </tr>
              <tr>
                <th scope="row">실행 시간</th>
                <td>
                  {!simLoading &&
                    timeFormatting(parseInt(simStatus.sim_duration))}
                </td>
              </tr>
              <tr>
                <th scope="row">데이터 상 시작 시각</th>
                <td>{!simLoading && simStatus.sim_data_start_time}</td>
              </tr>

              <tr>
                <th scope="row">데이터 상 마지막 시각</th>
                <td>{!simLoading && simStatus.sim_data_last_time}</td>
              </tr>
              <tr>
                <th scope="row">데이터 상 경과 시간</th>
                <td>
                  {!simLoading &&
                    timeFormatting(parseInt(simStatus.sim_data_duration))}
                </td>
              </tr>
              <tr>
                <th scope="row">데이터 1회 생성 시간</th>
                <td>{!simLoading && simStatus.avg_save_time}초</td>
              </tr>
              <tr>
                <th scope="row">실제 실행 속도</th>
                <td>{!simLoading && simStatus.sim_speed}배속</td>
              </tr>
              <tr>
                <th scope="row">생성된 입원정보 행 수</th>
                <td>{!simLoading && simStatus.sim_hosp_n}행</td>
              </tr>
              <tr>
                <th scope="row">생성된 생체징후 행 수</th>
                <td>{!simLoading && simStatus.sim_vital_n}행</td>
              </tr>
              <tr>
                <th scope="row">생성된 검사결과 행 수</th>
                <td>{!simLoading && simStatus.sim_lab_n}행</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Simulator;
