import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import MarkdownEditor from "../../markdown/MarkdownEditor";
import MarkdownViewer from "../../markdown/MarkdownViewer";

export default function App() {
  return (
    <Routes path="">
      <Route index element={<Navigate to="1" />} />
      <Route path=":markid" element={<MarkdownViewer />} />
      <Route path="editor" element={<MarkdownEditor />} />
    </Routes>
  );
}
