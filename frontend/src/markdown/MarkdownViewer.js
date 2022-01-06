import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import "./markdown-editor.css";

export default function MarkdownViewer(props) {
  const [markdownTitle, setMarkdownTitle] = useState(null);
  const [markdownText, setMarkdownText] = useState(null);
  const [markdownList, setMarkdownList] = useState(null);
  const { markid } = useParams();

  useEffect(() => {
    getMarkdownList();
    getMarkdownText();
  }, [markid]);

  const titleStyle = {
    color: "white",
    background: "LightSlateGray",
    fontSize: "28px",
    fontWeight: "700",
    padding: "1rem 1rem",
  };

  async function getMarkdownList() {
    try {
      const response = await axios({
        method: "get",
        url: `/api/instruction/list/`,
      });

      let mdList = response.data.results;
      mdList.sort((a, b) => a.markid - b.markid);
      setMarkdownList(mdList);
    } catch (error) {
      console.error(error);
    }
  }

  async function getMarkdownText() {
    try {
      const response = await axios({
        method: "get",
        url: `/api/instruction/list/${markid}/`,
      });
      setMarkdownTitle(response.data.title);
      setMarkdownText(response.data.content);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container py-3">
      {markdownList && (
        <div className="row">
          <div className="markdown-body col-md-3">
            <div className="mt-5">
              <div className="row">
                <div className="list-group col-12 px-4">
                  {markdownList.map((item, index) => {
                    return (
                      <Link
                        to={`/instruction/${index + 1}`}
                        type="button"
                        className="list-group-item list-group-item-action"
                        aria-current="true"
                        key={index}
                      >
                        {item.markid}.&ensp; {item.title}
                      </Link>
                    );
                  })}
                </div>
                <div className="my-4 d-flex align-items-center justify-content-center">
                  <button className="btn btn-warning mx-2">생성</button>
                </div>
              </div>
            </div>
          </div>
          <div className="markdown-body col-md-9 align-items-center">
            <div style={titleStyle}>
              {markid} |&ensp; {markdownTitle}
              <button className="btn btn-slategray btn-sm mx-3">수정</button>
            </div>
            <ReactMarkdown className="px-2" children={markdownText} />
          </div>
        </div>
      )}
    </div>
  );
}
