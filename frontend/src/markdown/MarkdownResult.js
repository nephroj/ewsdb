import React from "react";
import ReactMarkdown from "react-markdown";
import { useRecoilValue } from "recoil";
import { markdownAtom } from "../Store";

import "./github-markdown.css";

export function MarkdownResult(props) {
  const markdownText = useRecoilValue(markdownAtom);

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
        <ReactMarkdown children={markdownText} />
      </div>
      <div className="mt-5">
        <div className="d-flex align-items-center justify-content-center">
          <button type="submit" className="btn btn-steelblue mx-2">
            저장
          </button>
          <button className="btn btn-slategray mx-2">취소</button>
        </div>
      </div>
    </div>
  );
}
