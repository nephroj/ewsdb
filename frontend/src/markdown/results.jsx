import React, { useContext } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import { useRecoilValue } from "recoil";
import { markdownAtom } from "../Store";

const Container = styled.div`
  width: 50%;
  height: 100%;
  padding: 13px;
  font-family: "Lato", sans-serif;
  margin-left: auto;
  margin-right: 0;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 1em;
  padding: 8px 0;
  border-bottom: 1px solid rgba(15, 15, 15, 0.3);
`;

const ResultArea = styled.div`
  width: 100%;
  height: 100%;
  border: none;
  font-size: 17px;
`;

export function Result(props) {
  const markdownText = useRecoilValue(markdownAtom);

  return (
    <Container>
      <ResultArea className="mt-4 px-3">
        <ReactMarkdown children={markdownText} />
      </ResultArea>
    </Container>
  );
}
