import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import { updateLoadingAtom } from "../Store";

function HomeUI() {
  const [simStatus, setSimStatus] = useState({});
  const [updateLoading, setUpdateLoading1] = useRecoilState(updateLoadingAtom);

  useEffect(() => {
    getSimStatus();
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

  async function updateDataInfo() {
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
      console.log(results);
      setUpdateLoading1(false);
    } catch (err) {
      console.log(err.response.data);
      setUpdateLoading1(false);
    }
  }

  function make_comma(int_text) {
    const text = parseInt(int_text).toLocaleString("en-US");
    return text;
  }
  function make_date(date_text, sep = "/") {
    if (date_text) {
      const text =
        date_text.substring(0, 4) +
        sep +
        date_text.substring(4, 6) +
        sep +
        date_text.substring(6, 8);
      return text;
    }
  }

  return (
    <div className="container py-3">
      <section className="pt-5 pb-4 text-center container">
        <div className="row py-lg-4">
          <div className="col-lg-6 col-md-8 mx-auto">
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
                className="btn btn-steelblue btn-lg mt-2 mx-2"
                type="button"
              >
                시뮬레이터로 이동
              </Link>
              <Link
                to="/instruction"
                className="btn btn-slategray btn-lg mt-2"
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
              <ul className={"icon-list" + (updateLoading && " text-muted")}>
                <li>
                  포함된 기간: {make_date(simStatus.adm_date__min)}~
                  {make_date(simStatus.adm_date__max)}
                </li>
                <li>전체 입원 수: {make_comma(simStatus.adm__count)}개</li>
                <li>전체 환자 수: {make_comma(simStatus.studyid__count)}명</li>
                <li>
                  전체 vital sign 행수: {make_comma(simStatus.vital__count)}개
                </li>
                <li>
                  전체 lab 데이터 행수: {make_comma(simStatus.lab__count)}개
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
                    className="btn btn-cadetblue col-12 col-md-6 mx-auto"
                    type="button"
                    onClick={updateDataInfo}
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
                이전 정보가 표시됩니다. 실시간 정보는 시뮬레이터 화면에서
                확인하여 주세요.
              </p>
              <ul className="icon-list">
                <li>
                  작동 여부:{" "}
                  {parseInt(simStatus.is_active) ? (
                    <b className="text-success">● 실행 중</b>
                  ) : (
                    <b className="text-danger">● 중지됨</b>
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
                <button
                  to="/instruction"
                  className="btn btn-cadetblue col-12 col-lg-6 mx-auto"
                  type="button"
                  onClick={getSimStatus}
                  disabled={!parseInt(simStatus.is_active)}
                >
                  현황 업데이트
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeUI;
