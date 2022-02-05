import React, { useEffect, useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import { updateLoadingAtom } from "../Store";

function HomeUI() {
  const [simStatus, setSimStatus] = useState({});
  const [dataStatus, setDataStatus] = useState({});
  const [updateLoading, setUpdateLoading1] = useRecoilState(updateLoadingAtom);
  const navigate = useNavigate();

  useEffect(() => {
    getSimStatus();
    getDataStatus();
  }, [updateLoading]);

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

  async function updateDataStatus() {
    try {
      setUpdateLoading1(true);
      const res = await axios({
        method: "post",
        url: "/api/datainfo/",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        data: { action: "update" },
      });
      const results = res.data;
      setUpdateLoading1(false);
    } catch (err) {
      console.log(err.response.data);
      setUpdateLoading1(false);
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
          speed: 300,
          from_prev: 1,
        },
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      console.log(res.data);
      navigate("/simulator");
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
      navigate("/simulator");
    } catch (err) {
      console.log(err.response.data.detail);
    }
  }

  function make_comma(number) {
    if (!number) {
      return number;
    } else if (typeof number == "number") {
      const text = number.toLocaleString("en-US");
      return text;
    } else {
      return number;
    }
  }
  function make_date(date, sep = "/") {
    if (date) {
      const date_text = String(date);
      const text =
        date_text.substring(0, 4) +
        sep +
        date_text.substring(4, 6) +
        sep +
        date_text.substring(6, 8);
      return text;
    } else {
      return date;
    }
  }

  return (
    <div className="container">
      <section className="pt-5 pb-4 text-center">
        <div className="row py-lg-4">
          <div className="col-xl-6 col-lg-8 col-md-10 mx-auto">
            <h1 className="fw-light">입원 데이터 시뮬레이션</h1>
            <p className="lead text-muted">
              데이터베이스에 입원 데이터가 실시간으로 생성되도록 하는
              도구입니다. 급성 악화(acute deterioration)를 실시간으로 예측하는
              모델을 실제로 적용해 볼 수 있도록 가능한 현실과 비슷한 상황을
              가정하고 구현하였습니다.
            </p>
            <p>
              <Link
                to="/simulator"
                className="btn btn-steelblue btn-lg col-10 col-md-6 col-lg-4 mt-2 mx-2"
                type="button"
              >
                시뮬레이터로 이동
              </Link>
              <Link
                to="/instruction/1"
                className="btn btn-slategray btn-lg col-10 col-md-6 col-lg-4 mt-2"
                type="button"
              >
                설명서로 이동
              </Link>
            </p>
          </div>
        </div>
      </section>
      <hr className="col-4 col-md-2 mb-5 mx-auto" />

      <div className="row g-5 py-md-4 col-lg-9 mx-auto">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body px-4 py-4">
              <h3 className="text-center">풀링 데이터 정보</h3>
              <p className="text-center">
                실시간 데이터를 생성하기 위해 미리 저장시켜 놓은 풀링
                데이터입니다. 전산과에서 제공받은 데이터가 거의 가공 없이 저장된
                상태입니다.
              </p>
              <ul className={`icon-list ${updateLoading && "text-muted"}`}>
                <li>
                  포함된 기간: {make_date(dataStatus.adm_date_min)}~
                  {make_date(dataStatus.adm_date_max)}
                </li>
                <li>전체 입원 수: {make_comma(dataStatus.adm_count)}개</li>
                <li>전체 환자 수: {make_comma(dataStatus.studyid_count)}명</li>
                <li>
                  전체 vital sign 행수: {make_comma(dataStatus.vital_count)}개
                </li>
                <li>
                  전체 lab 데이터 행수: {make_comma(dataStatus.lab_count)}개
                </li>
              </ul>
              {updateLoading ? (
                <div
                  className="spinner-border text-secondary d-grid mx-auto"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <div className="d-grid mx-auto">
                  <button
                    to="/instruction"
                    className="btn btn-rosybrown col-12 col-md-6 mx-auto"
                    type="button"
                    onClick={updateDataStatus}
                  >
                    정보 업데이트
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-body px-4 py-4">
              <h3 className="text-center">시뮬레이터 현황</h3>
              <p className="text-center">
                시뮬레이터의 작동 상황과 요약 정보입니다. 작동 중이 아닐 때는
                이전 정보가 표시됩니다. 추가 설정은 시뮬레이터 화면에서 확인하여
                주세요.
              </p>
              <ul className="icon-list">
                <li>
                  작동 여부:{" "}
                  {simStatus.is_active ? (
                    <b className="text-success">● 실행 중</b>
                  ) : (
                    <b className="text-danger">● 중지 상태</b>
                  )}
                </li>
                <li>실행 시작 시각: {simStatus.sim_start_time}</li>
                <li>실행 시간: {simStatus.sim_duration}분</li>
                <li>실제 실행 속도: {simStatus.sim_speed}배속</li>
                <li>
                  Hosp {simStatus.sim_hosp_n} | Vital {simStatus.sim_vital_n} |
                  Lab {simStatus.sim_lab_n}
                </li>
              </ul>

              <div className="d-grid">
                {simStatus.is_active ? (
                  <input
                    type="button"
                    className="btn btn-slategray col-12 col-lg-6 mx-auto"
                    onClick={(e) => {
                      if (window.confirm("시뮬레이션을 중단하시겠습니까?"))
                        onStop(e);
                    }}
                    value="중지"
                  />
                ) : (
                  <input
                    type="button"
                    className="btn btn-seagreen col-12 col-lg-6 mx-auto"
                    onClick={(e) => {
                      if (window.confirm("시뮬레이션을 시작하시겠습니까?"))
                        onStart(e);
                    }}
                    value="시작 (100배속)"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeUI;
