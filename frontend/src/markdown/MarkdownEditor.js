import React from "react";
import { MarkdownInput } from "./MarkdownInput";
import { MarkdownResult } from "./MarkdownResult";
import "./markdown-editor.css";

export default function MarkdownEditor() {
  return (
    <div className="row">
      <div className="col-md-6 mp-zero">
        <MarkdownInput />
      </div>
      <div className="col-md-6 mp-zero">
        <MarkdownResult />
      </div>
    </div>
  );
}
