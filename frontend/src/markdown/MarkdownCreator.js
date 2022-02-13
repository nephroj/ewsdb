import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { MarkdownInput } from "./MarkdownInput";
import { MarkdownResult } from "./MarkdownResult";
import { mdContentAtom, mdErrorAtom, mdValErrorAtom } from "../Store";
import { setLogging } from "../Utils";
import "./markdown-editor.css";

export default function MarkdownCreator(props) {
  const navigate = useNavigate();
  const isCreate = JSON.parse(props.isCreate);
  const { markid } = useParams();
  const [mdContent, setMdContent] = useRecoilState(mdContentAtom);
  const [mdError, setMdError] = useRecoilState(mdErrorAtom);
  const [markidError, setMarkidError] = useState(null);
  const mdValError = useRecoilValue(mdValErrorAtom);

  async function createInstruction(inputData) {
    const method = isCreate ? "post" : "put";
    const url = isCreate
      ? "/api/instruction/create/"
      : `/api/instruction/list/${markid}/`;

    try {
      const response = await axios({
        method: method,
        url: url,
        data: inputData,
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      // logging
      let log_text = isCreate ? "Create: " : "Update: ";
      log_text = log_text + mdContent.markid + ". " + mdContent.title;
      setLogging("INFO", log_text);

      // move to markdown viewer
      navigate(`/instruction/${mdContent.markid}`);
    } catch (error) {
      console.log(error.response.data);
      for (const [key, value] of Object.entries(error.response.data)) {
        setMdError((prevState) => ({
          ...prevState,
          [key]: value[0],
        }));
      }
      setMarkidError(Object.values(error.response.data)[0]);
    }
  }

  return (
    <div className="row">
      <nav className="navbar navbar-mp navbar-light fixed-bottom">
        <div className="container justify-content-center">
          <h1 className="navbar-brand d-none d-md-block">
            작성 완료 후 저장 버튼을 눌러 주세요
          </h1>
          <div className="d-flex">
            <button
              className="btn btn-steelblue btn-sm mx-2"
              onClick={() => createInstruction(mdContent)}
              disabled={
                !/\d+/.test(mdContent.markid) ||
                !mdContent.title ||
                !mdContent.content ||
                mdValError.markid ||
                mdValError.title ||
                mdValError.content
                  ? true
                  : false
              }
            >
              저장하기
            </button>
            <button
              className="btn btn-slategray btn-sm mx-2"
              onClick={() => navigate(-1)}
            >
              뒤로 이동
            </button>
          </div>
        </div>
      </nav>
      <div className="col-md-6 mp-zero">
        <MarkdownInput
          Action={createInstruction}
          isCreate={props.isCreate}
          origMarkid={markid ? markid : 0}
        />
      </div>
      <div className="col-md-6 mp-zero">
        <MarkdownResult />
      </div>
    </div>
  );
}
