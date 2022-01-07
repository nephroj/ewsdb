import React from "react";
import ReactMarkdown from "react-markdown";
import { useRecoilState } from "recoil";
import { mdContentAtom } from "../Store";

import "./github-markdown.css";

export function MarkdownResult(props) {
  const [mdContent, setMdContent] = useRecoilState(mdContentAtom);

  return (
    <div className="editor-body">
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
