import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import axios from "axios";

import { MarkdownInput } from "./MarkdownInput";
import { MarkdownResult } from "./MarkdownResult";
import { mdContentAtom } from "../Store";
import "./markdown-editor.css";

export default function MarkdownCreator() {
  const [mdContent, setMdContent] = useRecoilState(mdContentAtom);

  // Create 하기 전 초기화
  // useEffect(() => {
  //   setMdContent({
  //     markid: null,
  //     content: "",
  //     title: "",
  //   });
  // }, []);

  async function createInstruction(inputData) {
    try {
      const response = await axios({
        method: "post",
        url: "/api/instruction/create/",
        data: inputData,
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error.response);
    }
  }

  return (
    <div className="row">
      <div className="col-md-6 mp-zero">
        <MarkdownInput />
      </div>
      <div className="col-md-6 mp-zero">
        <MarkdownResult Action={createInstruction} />
      </div>
    </div>
  );
}
