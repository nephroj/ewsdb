import { atom, selector } from "recoil";

// define atoms
export const isAuthAtom = atom({
  key: "isAuthAtom",
  default: false,
});

export const markdownAtom = atom({
  key: "markdownAtom",
  default: "",
});

export const updateLoadingAtom = atom({
  key: "updateLoading1Atom",
  default: false,
});
