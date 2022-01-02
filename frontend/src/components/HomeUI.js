import React from "react";
import { Link } from "react-router-dom";

function HomeUI() {
  return (
    <div className="container py-3">
      <section className="py-5 text-center container">
        <div className="row py-lg-4">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">입원 데이터 시뮬레이션</h1>
            <p className="lead text-muted">
              입원 데이터가 데이터베이스에 실시간으로 생성되도록 하는
              도구입니다. 급성 악화(acute deterioration)를 실시간으로 예측하는
              모델을 실제로 적용해 볼 수 있도록 가능한 현실과 비슷한 상황을
              가정하고 구현하였습니다.
            </p>
            <p>
              <Link to="/simulator" className="btn btn-steelblue" type="button">
                시뮬레이터로 이동
              </Link>
              <Link
                to="/instruction"
                className="btn btn-slategray mx-2"
                type="button"
              >
                설명서로 이동
              </Link>
            </p>
          </div>
        </div>
      </section>
      <hr className="col-6 col-md-4 mb-5 mx-auto" />

      <div className="row g-5 px-5 mx-auto">
        <div className="col-md-5 mx-auto">
          <h3>풀링된 데이터 현황</h3>
          <p>
            실시간으로 데이터를 생성하기 위해 미리 저장시켜 놓은 데이터입니다.
            전산과에서 제공받은 데이터를 거의 가공 없이 저장시켜 놓았습니다.
          </p>
          <ul className="icon-list">
            <li>포함된 기간:</li>
            <li>전체 입원 수:</li>
            <li>전체 vital sign 행수: </li>
            <li>전체 lab 데이터 행수:</li>
          </ul>
        </div>

        <div className="col-md-5 mx-auto">
          <h3>시뮬레이터 현황</h3>
          <p>시뮬레이터의 현재 작동 여부와 간단한 정보입니다.</p>
          <ul className="icon-list">
            <li>작동 여부:</li>
            <li>작동 시작된 시각:</li>
            <li>시작 날짜:</li>
            <li>저장 1회에 소요된 시간:</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomeUI;
