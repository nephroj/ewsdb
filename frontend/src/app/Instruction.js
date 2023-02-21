import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { navMenuAtom, isAuthAtom } from "../Store";
import MarkdownViewer from "../markdown/MarkdownViewer";
import MarkdownCreator from "../markdown/MarkdownCreator";
import { getAPIStatus } from "../Utils";

export default function App() {
  const setNavMenu = useSetRecoilState(navMenuAtom);
  const setIsAuth = useSetRecoilState(isAuthAtom);

  useEffect(() => {
    setNavMenu("instruction");
    getAPIStatus(setIsAuth);
  }, []);

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
