import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import axios from "axios";
import { mdContentAtom } from "../Store";

export function MarkdownInput(props) {
  const navigate = useNavigate();
  const isCreate = JSON.parse(props.isCreate);
  const origMarkid = parseInt(props.origMarkid);
  const textareaDefaultHeight = window.innerHeight * 0.7 - 100;
  const [mdContent, setMdContent] = useRecoilState(mdContentAtom);
  const [offsetHeight, setOffsetHeight] = useState(textareaDefaultHeight);
  const [initializeText, setInitializeText] = useState(isCreate);
  const [markids, setMarkids] = useState(null);

  useEffect(() => {
    getMarkIds();
    if (initializeText) {
      setMdContent({
        markid: "",
        content: "",
        title: "",
      });
      setInitializeText(false);
    }
  }, []);

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
      let markidarray = [];
      for (let i = 0; i < response.data.results.length; i++) {
        const item = response.data.results[i];
        markidarray.push(item.markid);
      }
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
  }

  return (
    <div className="editor-body editor-vline">
      <div className="my-3 row">
        {props.markidError && (
          <div className="text-invalid">문서 번호를 다시 선택해 주세요.</div>
        )}
        <div className="col-md-2 mb-3">
          <select
            id="markid"
            className="form-select"
            aria-label="MarkID"
            onChange={onTextChange}
            onFocus={getMarkIds}
          >
            {origMarkid && (
              <option defaultValue={origMarkid}>{origMarkid}</option>
            )}
            {markids &&
              markids.map((value, key) => {
                return (
                  <option value={value} key={key}>
                    {value}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="col-md-10 mb-3">
          <input
            id="title"
            type="text"
            className="form-control"
            placeholder="제목을 입력해 주세요"
            onChange={onTextChange}
            value={mdContent.title}
          />
        </div>
      </div>

      <textarea
        id="content"
        className="editor-textarea form-control"
        style={textAreaStyle}
        value={mdContent.content}
        onChange={onTextChange}
        onFocus={onSizeChange}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            onSizeChange(e);
          }
        }}
        placeholder="마크다운 내용을 입력해 주세요"
      />
      <div className="mt-5">
        <div className="d-flex align-items-center justify-content-center">
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
