import React from "react";
import ReactMarkdown from "react-markdown";
import { useRecoilState } from "recoil";
import { mdContentAtom } from "../Store";

import "./github-markdown.css";

export function MarkdownResult(props) {
  const [mdContent, setMdContent] = useRecoilState(mdContentAtom);

  return (
    <div className="editor-body">
      {/* <h1 className="mb-3 text-success">[결과 확면]</h1> */}
      <div className="markdown-body">
        {mdContent.title && (
          <div className="title-style mb-3 px-lg-4">
            {mdContent.markid} |&ensp; {mdContent.title}
          </div>
        )}
        <ReactMarkdown className="px-3" children={mdContent.content} />
      </div>
    </div>
  );
}
