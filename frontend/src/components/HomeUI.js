import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isAuthAtom,
  navMenuAtom,
  simStatusAtom,
  updateLoadingAtom,
  dataStatusAtom,
} from "../Store";
import {
  make_comma,
  make_date,
  timeFormatting,
  setLogging,
  getAPIStatus,
} from "../Utils";

function HomeUI() {
  const [updateLoading, setUpdateLoading1] = useRecoilState(updateLoadingAtom);
  const setNavMenu = useSetRecoilState(navMenuAtom);
  const [simStatus, setSimStatus] = useRecoilState(simStatusAtom);
  const [dataStatus, setDataStatus] = useRecoilState(dataStatusAtom);
  const setIsAuth = useSetRecoilState(isAuthAtom);

  useEffect(() => {
    setLogging("INFO", "Moved to Home");
    setNavMenu("home");
    getAPIStatus(setIsAuth);
    getDataStatus();
  }, [updateLoading]);

  useEffect(() => {
    getSimStatus();
    if (simStatus.is_active) {
      const interval = setInterval(() => {
        getSimStatus();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [simStatus.is_active]);

  // Simuation 현황 불러오기
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
      console.log(err.response.status);
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

  // 정보 업데이트 클릭 시 풀링된 데이터 현황 업데이트
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
      setLogging("INFO", "Update DataStatus");
      setUpdateLoading1(false);
    } catch (err) {
      console.log(err.response.data);
      setUpdateLoading1(false);
    }
  }

  return (
    <div className="container">
      <section className="pt-5 pb-3 text-center">
        <div className="row py-lg-4">
          <div className="col-xl-6 col-lg-8 col-md-10 mx-auto">
            <h1 className="fw-light">입원 데이터 시뮬레이션</h1>
            <p className="lead text-muted">
              데이터베이스에 입원 데이터가 실시간으로 생성되도록 하는
              도구입니다. 급성 악화(acute deterioration)를 실시간으로 예측하는
              모델을 실제로 적용해 볼 수 있도록 가능한 현실과 비슷한 상황을
              가정하고 구현하였습니다.
            </p>
          </div>
        </div>
      </section>
      <hr className="col-4 col-md-2 mb-5 mx-auto" />

      <div className="row g-5 py-md-4 col-lg-9 mx-auto">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-body px-4 py-4">
              <h3 className="text-center mb-3">풀링 데이터 정보</h3>
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

        <div className="col-xl-6">
          <div className="card">
            <div className="card-body px-4 py-4">
              <h3 className="text-center mb-3">시뮬레이터 현황</h3>
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
                    <b className="text-danger">● 중지됨</b>
                  )}
                </li>
                <li>실행 시작 시각: {simStatus.sim_start_time}</li>
                <li>
                  실행 시간: {timeFormatting(parseInt(simStatus.sim_duration))}
                </li>
                <li>실제 실행 속도: {simStatus.sim_speed}배속</li>
                <li>
                  Hosp {simStatus.sim_hosp_n} | Vital {simStatus.sim_vital_n} |
                  Lab {simStatus.sim_lab_n}
                </li>
              </ul>

              <div className="d-grid">
                <Link
                  to="/simulator"
                  type="button"
                  className="btn btn-seagreen col-12 col-md-6 mx-auto"
                >
                  시뮬레이터로 이동
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeUI;
