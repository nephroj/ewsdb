import React, { useEffect, useState } from "react";
import { navMenuAtom, isAuthAtom } from "../Store";
import { to_fixed, setLogging, getAPI } from "../Utils";
import { useSetRecoilState } from "recoil";

function ServerInfo() {
  const [serverData, setServerData] = useState({});
  const [simLog, setSimLog] = useState([]);
  const [errorLog, setErrorLog] = useState([]);
  const setNavMenu = useSetRecoilState(navMenuAtom);
  const setIsAuth = useSetRecoilState(isAuthAtom);

  // 페이지 첫 로드 시
  useEffect(() => {
    setLogging("INFO", "Moved to ServerInfo");
    setNavMenu("serverinfo");
    getServerInfo();
    getSimLog();

    const interval = setInterval(() => {
      getServerInfo();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ServerInfo 불러오기
  async function getServerInfo() {
    const response = await getAPI("/api/serverinfo/");
    if (response.status === 401) {
      localStorage.clear();
      setIsAuth(false);
    }
    setServerData(response.data);
  }

  // SimLog 불러오기
  async function getSimLog() {
    const response = await getAPI("/api/viewlog/");
    setSimLog(response.data.sim_log);
    setErrorLog(response.data.error_log);
  }

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-lg-4 mb-4">
          <div className="card">
            <h5 className="card-header">
              <svg
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-cpu"
                viewBox="0 0 16 16"
              >
                <path d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0zm-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3h-7zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
              </svg>{" "}
              CPU
            </h5>
            <div className="card-body">
              <h5 className="card-title">CPU 정보</h5>
              <ul className="card-text">
                <li>코어 갯수: {serverData.cpu_cores}개</li>
                <li>쓰레드 갯수: {serverData.cpu_threads}개</li>
                <li>현재 클럭속도: {serverData.cpu_current_freq} MHz</li>
              </ul>
              <h5 className="card-title">
                CPU 이용률: {serverData.cpu_usage}%
              </h5>

              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${serverData.cpu_usage}%` }}
                  aria-valuenow={serverData.cpu_usage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {serverData.cpu_usage}%
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card">
            <h5 className="card-header">
              <svg
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-memory"
                viewBox="0 0 16 16"
              >
                <path d="M1 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.586a1 1 0 0 0 .707-.293l.353-.353a.5.5 0 0 1 .708 0l.353.353a1 1 0 0 0 .707.293H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H1Zm.5 1h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5Zm5 0h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5Zm4.5.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4ZM2 10v2H1v-2h1Zm2 0v2H3v-2h1Zm2 0v2H5v-2h1Zm3 0v2H8v-2h1Zm2 0v2h-1v-2h1Zm2 0v2h-1v-2h1Zm2 0v2h-1v-2h1Z" />
              </svg>{" "}
              Memory
            </h5>
            <div className="card-body">
              <h5 className="card-title">RAM 정보</h5>
              <ul className="card-text">
                <li>전체 용량: {to_fixed(serverData.ram_total, 1)} GB</li>
                <li>사용 중인 용량: {to_fixed(serverData.ram_used, 1)} GB</li>
                <li>가용 용량: {to_fixed(serverData.ram_available, 1)} GB</li>
              </ul>
              <h5 className="card-title">RAM 사용량</h5>
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${serverData.ram_used_perc}%` }}
                  aria-valuenow={serverData.ram_used_perc}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {serverData.ram_used_perc}%
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card">
            <h5 className="card-header">
              <svg
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-device-hdd"
                viewBox="0 0 16 16"
              >
                <path d="M12 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm0 11a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm-7.5.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1ZM5 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM8 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                <path d="M12 7a4 4 0 0 1-3.937 4c-.537.813-1.02 1.515-1.181 1.677a1.102 1.102 0 0 1-1.56-1.559c.1-.098.396-.314.795-.588A4 4 0 0 1 8 3a4 4 0 0 1 4 4Zm-1 0a3 3 0 1 0-3.891 2.865c.667-.44 1.396-.91 1.955-1.268.224-.144.483.115.34.34l-.62.96A3.001 3.001 0 0 0 11 7Z" />
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H4Z" />
              </svg>{" "}
              Disk
            </h5>
            <div className="card-body">
              <h5 className="card-title">Disk 정보</h5>
              <ul className="card-text">
                <li>전체 용량: {to_fixed(serverData.disk_total, 0)} GB</li>
                <li>사용 중인 용량: {to_fixed(serverData.disk_used, 0)} GB</li>
                <li>가용 용량: {to_fixed(serverData.disk_available, 0)} GB</li>
              </ul>
              <h5 className="card-title">Disk 사용량</h5>
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${serverData.disk_used_perc}%` }}
                  aria-valuenow={serverData.disk_used_perc}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {serverData.disk_used_perc}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mt-lg-4">
          <div className="card">
            <h5 className="card-header">
              <svg
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-file-earmark-text"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
              </svg>{" "}
              Simulator Log
            </h5>
            <div className="card-body">
              <h5 className="card-title">작동 기록 (최근 20개)</h5>
              <ol className="text-monospace">
                {simLog &&
                  simLog.map((value, index) => {
                    return <li key={index}>{value}</li>;
                  })}
              </ol>
            </div>
          </div>
        </div>
        <div className="col-12 mt-lg-4 mb-5">
          <div className="card">
            <h5 className="card-header">
              <svg
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-file-earmark-x"
                viewBox="0 0 16 16"
              >
                <path d="M6.854 7.146a.5.5 0 1 0-.708.708L7.293 9l-1.147 1.146a.5.5 0 0 0 .708.708L8 9.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 9l1.147-1.146a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146z" />
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
              </svg>{" "}
              Error Log
            </h5>
            <div className="card-body">
              <h5 className="card-title">에러 기록 (최근 20개)</h5>
              <ol className="text-monospace">
                {errorLog &&
                  errorLog.map((value, index) => {
                    return <li key={index}>{value}</li>;
                  })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServerInfo;
