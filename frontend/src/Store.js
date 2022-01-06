import { atom, selector } from "recoil";

// define atoms
export const isAuthAtom = atom({
  key: "isAuthAtom",
  default: false,
});

export const mdContentAtom = atom({
  key: "mdContentAtom",
  default: {
    markid: null,
    title: "",
    content: "",
  },
});

export const updateLoadingAtom = atom({
  key: "updateLoading1Atom",
  default: false,
});
