import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import MarkdownEditor from "../../markdown/MarkdownEditor";
import MarkdownViewer from "../../markdown/MarkdownViewer";
import MarkdownCreator from "../../markdown/MarkdownCreator";

export default function App() {
  return (
    <Routes path="">
      <Route index element={<Navigate to="1" />} />
      <Route path=":markid" element={<MarkdownViewer />} />
      <Route
        path=":markid/update"
        element={<MarkdownCreator isCreate="false" />}
      />
      <Route path="create" element={<MarkdownCreator isCreate="true" />} />
    </Routes>
  );
}
