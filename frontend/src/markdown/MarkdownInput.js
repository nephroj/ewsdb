import React, { useState, useEffect } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import axios from "axios";
import { mdContentAtom, mdErrorAtom, mdValErrorAtom } from "../Store";

export function MarkdownInput(props) {
  const [mdContent, setMdContent] = useRecoilState(mdContentAtom);
  const [mdError, setMdError] = useRecoilState(mdErrorAtom);
  const [mdValError, setMdValError] = useRecoilState(mdValErrorAtom);
  const resetMdContent = useResetRecoilState(mdContentAtom);
  const resetMdError = useResetRecoilState(mdErrorAtom);
  const resetMdValError = useResetRecoilState(mdValErrorAtom);
  const isCreate = JSON.parse(props.isCreate);
  const [initializeText, setInitializeText] = useState(isCreate);
  const origMarkid = parseInt(props.origMarkid);
  const textareaDefaultHeight = window.innerHeight * 0.7 - 100;
  const [offsetHeight, setOffsetHeight] = useState(textareaDefaultHeight);
  const [markids, setMarkids] = useState(null);

  useEffect(() => {
    if (initializeText) {
      resetMdContent();
      setInitializeText(false);
    }
    resetMdError();
    resetMdValError();
  }, []);
  useEffect(() => {
    getMarkIds();
  }, [mdContent.markid]);

  const textAreaStyle = {
    width: "100%",
    height: offsetHeight,
    fontSize: "16px",
  };

  async function getMarkIds() {
    try {
      const response = await axios({
        method: "get",
        url: `/api/instruction/list/`,
      });

      // 현재 사용 중인 markid list를 얻음
      let markidarray = [];
      for (let i = 0; i < response.data.results.length; i++) {
        const item = response.data.results[i];
        markidarray.push(item.markid);
      }

      // 사용 중이 아닌 markid 10개를 순차적으로 얻어서 markids에 저장함
      let markidCandidate = [];
      for (let i = 1; i < 100; i++) {
        if (!markidarray.includes(i)) {
          markidCandidate.push(i);
        }
        if (markidCandidate.length >= 10) {
          break;
        }
      }
      setMarkids(markidCandidate);

      // create 상황에서 markid가 초기화되면 초기값 하나를 지정해 줌
      if (!mdContent.markid) {
        setMdContent((prevState) => ({
          ...prevState,
          markid: markidCandidate[0],
        }));
      }
    } catch (error) {
      console.error(error.response.data);
    }
  }

  // 특정 문장에서 가로폭을 계산하여 반환하는 기능
  function getTextWidth(text) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    // context.font = font || getComputedStyle(document.body).font;
    return context.measureText(text).width;
  }

  // \n 갯수와 위의 가로폭 계산 기능을 통해 얻은
  // 대략적인 row 수를 바탕으로 textarea height 조절
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

  // Input 내용 변경될 때 mdContent update
  function onTextChange(e) {
    e.preventDefault();
    let key = e.target.id;
    let value = e.target.value;

    setMdContent((prevState) => ({
      ...prevState,
      [key]: value,
    }));
    setMdError((prevState) => ({
      ...prevState,
      [key]: "",
    }));
    setMdValError((prevState) => ({
      ...prevState,
      [key]: "",
    }));
  }

  function textVal(e, wordLimit) {
    e.preventDefault();
    const key = e.target.id;
    const value = e.target.value;
    let error = "";
    if (!value) {
      error = "내용을 입력하여 주세요.";
    } else if (value.length >= wordLimit) {
      error = `${wordLimit}자 이하로 입력하여 주세요.`;
    }
    setMdValError((prevState) => ({
      ...prevState,
      [key]: error,
    }));
  }
  return (
    <div className="editor-body editor-vline mb-5">
      {/* <h1 className="mb-3 text-success">[마크다운 에디터]</h1> */}
      <div className="my-3 row">
        <div className="col-md-2 mb-3">
          <select
            id="markid"
            className={`form-select editor-select ${
              mdError.markid || mdValError.markid ? "is-invalid" : ""
            }`}
            aria-label="MarkID"
            onFocus={getMarkIds}
            onChange={onTextChange}
            // onBlur={markidVal}
          >
            {origMarkid && <option value={origMarkid}>{origMarkid}</option>}
            {markids &&
              markids.map((value, key) => {
                return (
                  <option value={value} key={key}>
                    {value}
                  </option>
                );
              })}
          </select>
          <div id="invalidMarkid" className="invalid-feedback">
            {mdError.markid ? mdError.markid : ""}
            {mdValError.markid ? mdValError.markid : ""}
          </div>
        </div>
        <div className="col-md-10 mb-3">
          <input
            id="title"
            type="text"
            className={`form-control editor-input ${
              mdError.title || mdValError.title ? "is-invalid" : ""
            }`}
            placeholder="제목을 입력해 주세요"
            onChange={onTextChange}
            onBlur={(e) => textVal(e, 120)}
            value={mdContent.title}
          />
          <div id="invalidTitle" className="invalid-feedback">
            {mdError.title ? mdError.title : ""}
            {mdValError.title ? mdValError.title : ""}
          </div>
        </div>
      </div>

      <textarea
        id="content"
        className={`editor-textarea form-control ${
          mdError.content || mdValError.content ? "is-invalid" : ""
        }`}
        style={textAreaStyle}
        value={mdContent.content}
        onChange={onTextChange}
        onBlur={(e) => textVal(e, 10000)}
        onFocus={onSizeChange}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            onSizeChange(e);
          }
        }}
        placeholder="마크다운 내용을 입력해 주세요"
      />
      <div id="invalidTitle" className="invalid-feedback">
        {mdError.content ? mdError.content : ""}
        {mdValError.content ? mdValError.content : ""}
      </div>
    </div>
  );
}
