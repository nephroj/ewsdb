import React from "react";
import styled from "styled-components";
import { MarkedInput } from "../../markdown/markedInput";
import { Result } from "../../markdown/results";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  font-size: 25px;
  font-weight: 700;
  font-family: "Lato", sans-serif;
  margin-bottom: 1em;
`;

const EditorContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

export default function App() {
  return (
    <AppContainer>
      {/* <Title>Markdown Editor</Title> */}
      <EditorContainer>
        <MarkedInput />
        <Result />
      </EditorContainer>
    </AppContainer>
  );
}
