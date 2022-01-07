import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { MarkdownInput } from "./MarkdownInput";
import { MarkdownResult } from "./MarkdownResult";
import { mdContentAtom } from "../Store";
import "./markdown-editor.css";

export default function MarkdownCreator(props) {
  const navigate = useNavigate();
  const isCreate = JSON.parse(props.isCreate);
  const { markid } = useParams();
  const [mdContent, setMdContent] = useRecoilState(mdContentAtom);
  const [markidError, setMarkidError] = useState(null);

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
      setMarkidError(error.response.data.markid);
    }
  }

  return (
    <div className="row">
      <div className="col-md-6 mp-zero">
        <MarkdownInput
          Action={createInstruction}
          isCreate={props.isCreate}
          origMarkid={markid ? markid : 0}
          markidError={markidError}
        />
      </div>
      <div className="col-md-6 mp-zero">
        <MarkdownResult />
      </div>
    </div>
  );
}
