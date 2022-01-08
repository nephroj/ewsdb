import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { MarkdownInput } from "./MarkdownInput";
import { MarkdownResult } from "./MarkdownResult";
import { mdContentAtom, mdErrorAtom, mdValErrorAtom } from "../Store";
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
      console.log(response.data);
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
      <nav className="navbar navbar-mp navbar-light ">
        <div className="container">
          <h1 className="navbar-brand">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              className="bi bi-pencil-square"
              viewBox="0 0 16 16"
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path
                fillRule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
              />
            </svg>{" "}
            설명서 수정하기
          </h1>
          <div className="d-flex">
            <button
              className="btn btn-steelblue mx-2"
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
              저장
            </button>
            <button
              className="btn btn-slategray mx-2"
              onClick={() => navigate(-1)}
            >
              취소
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
