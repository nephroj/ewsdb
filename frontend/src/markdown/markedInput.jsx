import React, { useState } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { markdownAtom } from "../Store";

const Container = styled.div`
  width: 50%;
  height: 100%;
  padding: 13px;
  border-right: 2px dotted lightgray;
  font-family: "Lato", sans-serif;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 600;
  padding: 8px 0;
`;

export function MarkedInput(props) {
  const [markdownText, setMarkdownText] = useRecoilState(markdownAtom);
  const [offsetHeight, setOffsetHeight] = useState(300);

  const textAreaStyle = {
    width: "100%",
    height: offsetHeight,
    fontSize: "16px",
  };

  function onTextChange(e) {
    const text = e.currentTarget.value;
    const n_rows = text.trim().split("\n").length;
    setMarkdownText(text);
    setOffsetHeight(n_rows > 8 ? n_rows * 24 + 100 : 300);
  }

  return (
    <Container>
      <Title>Markdown Editor</Title>
      <textarea
        style={textAreaStyle}
        value={markdownText}
        onChange={onTextChange}
      />
      <button type="submit" className="btn btn-steelblue">
        저장
      </button>
      <button className="btn btn-slategray">뒤로</button>
    </Container>
  );
}
