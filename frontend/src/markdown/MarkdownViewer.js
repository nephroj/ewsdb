import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";

import { mdContentAtom } from "../Store";
import "./markdown-editor.css";

export default function MarkdownViewer(props) {
  const navigate = useNavigate();
  const [mdContent, setMdContent] = useRecoilState(mdContentAtom);
  const [markdownList, setMarkdownList] = useState(null);
  const { markid } = useParams();

  useEffect(() => {
    getMarkdownList();
    getMarkdownText();
  }, [markid]);

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
      setMdContent({
        markid: response.data.markid,
        title: response.data.title,
        content: response.data.content,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container py-3">
      {markdownList && (
        <div className="row my-2">
          <div className="col-md-3 my-3">
            <div className="row">
              <div className="list-group col-12 px-4">
                <li className="list-group-item list-group-item-action title d-flex justify-content-between">
                  <div>목차</div>
                  <button
                    className="btn btn-seagreen btn-sm"
                    onClick={() => navigate("/instruction/create")}
                  >
                    생성
                  </button>
                </li>
                {markdownList.map((item, index) => {
                  return (
                    <Link
                      to={`/instruction/${item.markid}`}
                      className={`list-group-item list-group-item-action ${
                        item.markid == markid ? "active" : ""
                      }`}
                      aria-current="true"
                      key={index}
                    >
                      {item.markid}.&ensp; {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="markdown-body col-md-9 my-3">
            <div className="title-style mb-3 px-lg-4">
              {mdContent.markid} |&ensp; {mdContent.title}
              <button
                className="btn btn-slategray btn-sm mx-4"
                onClick={() =>
                  navigate(`/instruction/${mdContent.markid}/update`)
                }
              >
                수정
              </button>
            </div>
            <ReactMarkdown className="px-3" children={mdContent.content} />
          </div>
        </div>
      )}
    </div>
  );
}
