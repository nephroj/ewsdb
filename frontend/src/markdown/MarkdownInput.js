import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { markdownAtom } from "../Store";

export function MarkdownInput(props) {
  const textareaDefaultHeight = window.innerHeight * 0.8 - 100;
  const [markdownText, setMarkdownText] = useRecoilState(markdownAtom);
  const [offsetHeight, setOffsetHeight] = useState(textareaDefaultHeight);

  const textAreaStyle = {
    width: "100%",
    height: offsetHeight,
    fontSize: "16px",
  };

  function getTextWidth(text) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    // context.font = font || getComputedStyle(document.body).font;
    return context.measureText(text).width;
  }

  function onSizeChange(e) {
    const text = e.currentTarget.value;

    const texts = text.trim().split("\n");
    const nRows = texts.length;
    const offsetWidth = e.target.offsetWidth;
    const nAddrows = texts.reduce(
      (txt, txt1) =>
        txt + parseInt(getTextWidth(txt1) / ((offsetWidth - 10) * 0.6)),
      0
    );
    // console.log(nRows, nAddrows, offsetWidth);
    const nTotalrows = nRows + nAddrows;
    setOffsetHeight(
      nTotalrows > 8 ? nTotalrows * 26 + 150 : textareaDefaultHeight
    );
  }

  return (
    <div className="editor-body editor-vline">
      <div className="card mb-4">
        <div className="card-header">
          <div className="editor-title d-flex align-items-center justify-content-center">
            마크다운 편집기
          </div>
        </div>
      </div>

      <textarea
        className="editor-textarea"
        style={textAreaStyle}
        value={markdownText}
        onChange={(e) => setMarkdownText(e.currentTarget.value)}
        onBlur={onSizeChange}
      />
    </div>
  );
}