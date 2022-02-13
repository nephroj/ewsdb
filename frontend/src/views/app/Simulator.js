import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSetRecoilState, useRecoilState } from "recoil";
import { navMenuAtom, simStatusAtom } from "../../Store";
import { timeFormatting, make_date, slice_date, setLogging } from "../../Utils";

function Simulator() {
  // const [simStatus, setSimStatus] = useState({});
  const [dataStatus, setDataStatus] = useState({});
  const [simLoading, setSimLoading] = useState(false);
  const [simSpeed, setSimSpeed] = useState(100);
  const [startRadio, setStartRadio] = useState("start_manual");
  const [startDate, setStartDate] = useState("");
  const [startDateMan, setStartDateMan] = useState("");
  const setNavMenu = useSetRecoilState(navMenuAtom);
  const [simStatus, setSimStatus] = useRecoilState(simStatusAtom);

  // 페이지 첫 로드 시
  useEffect(() => {
    setLogging("INFO", "Moved to Simulator");
    setNavMenu("simulator");
    getDataStatus();
    getSimSettings();
  }, []);

  // 시뮬레이션 시작 혹은 중단 시 or 페이지 첫 로드 시
  useEffect(() => {
    getSimStatus();

    if (simStatus.is_active) {
      const interval = setInterval(() => {
        getSimStatus();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [simStatus.is_active]);

  // SimSettings 불러오기
  async function getSimSettings() {
    try {
      const res = await axios({
        method: "get",
        url: "/api/simsettings/",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      const results = res.data;
      setStartDateMan(results.sim_start_date);
      setSimSpeed(results.sim_speed);
      setStartDate(results.sim_start_date);
      setStartRadio(results.sim_start_radio);
    } catch (err) {
      console.log(err.response.data.detail);
    }
  }

  // SimStatus 불러오기
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

  // 풀링된 데이터 현황 불러오기
  async function getDataStatus() {
    try {
      const res = await axios({
        method: "get",
        url: "/api/datainfo/",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      const results = res.data;
      setDataStatus(results);
    } catch (err) {
      console.log(err.response.data.detail);
    }
  }

  async function onStart(e) {
    e.preventDefault();
    setSimLoading(true);

    try {
      const res = await axios({
        method: "post",
        url: "/api/simulator/",
        data: {
          operation: "start",
          speed: parseInt(simSpeed),
          start_date: startDate,
          start_radio: startRadio,
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
      setLogging(
        "INFO",
        "Simulation started | " + startDate + " | x" + simSpeed
      );
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
      setLogging(
        "INFO",
        "Simulation stopped | " +
          slice_date(simStatus.sim_data_last_time) +
          " | x" +
          simSpeed
      );
    } catch (err) {
      console.log(err.response.data.detail);
    }
  }

  function getStartDate(e) {
    const start_radio = e.target.value;
    let start_date = "";
    setStartRadio(start_radio);

    if (start_radio === "start_orig") {
      start_date = make_date(dataStatus.adm_date_min, "-");
    } else if (start_radio === "start_prev") {
      start_date = slice_date(simStatus.sim_data_last_time);
    } else {
      start_date = startDateMan;
    }
    setStartDate(start_date);
  }

  function manualStartDate(e) {
    const manual_date = e.target.value;
    setStartDate(manual_date);
    setStartDateMan(manual_date);
  }

  return (
    <div className="container py-lg-3">
      {/* 시뮬레이션 실행 상태 */}
      <div className="row">
        <div className="card col-11 col-lg-6 mt-5 mb-4 mb-lg-5 py-lg-2 mx-auto">
          <div className="card-body text-center">
            {simStatus.is_active ? (
              <h2>
                현재 상태: <b className="text-success">● 실행 중</b>
              </h2>
            ) : (
              <h2>
                현재 상태: <b className="text-danger">● 중지됨</b>
              </h2>
            )}
          </div>
        </div>
      </div>

      {/* 시뮬레이션 시작 시점 */}
      <div className="row mt-4 d-flex justify-content-center">
        <div className="col-lg-4 mx-4 px-4 py-lg-4">
          <div className="mb-5">
            <div className="mb-2">
              <b>시뮬레이션 시작 시점: </b> {startDate}
            </div>
            <div className="form-check mb-1 mx-2">
              <input
                className="form-check-input"
                type="radio"
                id="start_orig"
                value="start_orig"
                checked={startRadio === "start_orig"}
                onChange={getStartDate}
                disabled={simStatus.is_active}
              />
              <label className="form-check-label">처음부터</label>
            </div>
            <div className="form-check mb-1 mx-2">
              <input
                className="form-check-input"
                type="radio"
                id="start_prev"
                value="start_prev"
                checked={startRadio === "start_prev"}
                onChange={getStartDate}
                disabled={simStatus.is_active}
              />
              <label className="form-check-label">이전 종료 날짜</label>
            </div>
            <div className="form-check mx-2 mb-1">
              <input
                className="form-check-input"
                type="radio"
                id="start_manual"
                value="start_manual"
                checked={startRadio === "start_manual"}
                onChange={getStartDate}
                disabled={simStatus.is_active}
              />
              <label className="form-check-label">사용자 지정</label>
            </div>
            {startRadio === "start_manual" && (
              <div className="mb-3 mx-3 row">
                <div className="col-xl-9">
                  <input
                    type="date"
                    className="form-control"
                    id="manual_date"
                    value={startDateMan}
                    min={make_date(dataStatus.adm_date_min, "-")}
                    max={make_date(dataStatus.adm_date_max, "-")}
                    disabled={simStatus.is_active}
                    onChange={manualStartDate}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 데이터 진행속도 */}
          <div className="mb-5">
            <label htmlFor="Range400" className="form-label">
              <b>데이터 진행 속도:</b> 약 {simSpeed}배속
            </label>

            <input
              type="range"
              className="form-range"
              min="1"
              max="20"
              step="0.25"
              id="Range400"
              value={Math.sqrt(simSpeed)}
              onChange={(e) => {
                setSimSpeed(Math.round(Math.pow(e.target.value, 2)));
              }}
              disabled={simStatus.is_active}
            />
            <div className="row">
              <div className="col-6 text-left">
                <small> ×1</small>
              </div>
              <div className="col-6 text-right">
                <small>×400</small>
              </div>
            </div>
          </div>

          {/* 시작 버튼 */}
          <div className="d-flex justify-content-center mx-auto mb-5">
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
                disabled={!startDate}
              />
            )}
          </div>
        </div>

        {/* 시뮬레이터 현황판 */}
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
                  {!simLoading
                    ? timeFormatting(parseInt(simStatus.sim_duration))
                    : "0시간 0분"}
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
                  {!simLoading
                    ? timeFormatting(parseInt(simStatus.sim_data_duration))
                    : "0시간 0분"}
                </td>
              </tr>
              <tr>
                <th scope="row">데이터 1회 생성 시간</th>
                <td>{!simLoading ? simStatus.avg_save_time : "0"}초</td>
              </tr>
              <tr>
                <th scope="row">실제 실행 속도</th>
                <td>{!simLoading ? simStatus.sim_speed : "0"}배속</td>
              </tr>
              <tr>
                <th scope="row">생성된 입원정보 행 수</th>
                <td>{!simLoading ? simStatus.sim_hosp_n : "0"}행</td>
              </tr>
              <tr>
                <th scope="row">생성된 생체징후 행 수</th>
                <td>{!simLoading ? simStatus.sim_vital_n : "0"}행</td>
              </tr>
              <tr>
                <th scope="row">생성된 검사결과 행 수</th>
                <td>{!simLoading ? simStatus.sim_lab_n : "0"}행</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Simulator;
