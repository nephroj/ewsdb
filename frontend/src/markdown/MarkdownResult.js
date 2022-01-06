import React from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { mdContentAtom } from "../Store";

import "./github-markdown.css";

export function MarkdownResult(props) {
  const navigate = useNavigate();
  const [mdContent, setMdContent] = useRecoilState(mdContentAtom);
  function onMarkidChange(e) {
    setMdContent((prevState) => ({
      ...prevState,
      markid: e.target.value,
    }));
  }
  return (
    <div className="editor-body">
      <div className="card mb-4">
        <div className="card-header">
          <div className="editor-title d-flex align-items-center justify-content-center">
            출력 결과
          </div>
        </div>
      </div>
      <div className="markdown-body">
        {mdContent.title && (
          <div className="title-style">{mdContent.title}</div>
        )}
        <ReactMarkdown children={mdContent.content} />
      </div>
      <div className="mt-5">
        <div className="d-flex align-items-center justify-content-center">
          <input
            type="text"
            className="form-control"
            placeholder="Mark ID"
            onChange={onMarkidChange}
          />
          <button
            className="btn btn-steelblue mx-2"
            onClick={() => props.Action(mdContent)}
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
    </div>
  );
}
