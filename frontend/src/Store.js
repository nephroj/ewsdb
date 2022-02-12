import { atom, selector } from "recoil";

// define atoms
export const isAuthAtom = atom({
  key: "isAuthAtom",
  default: false,
});

export const navMenuAtom = atom({
  key: "navMenuAtom",
  default: "",
});

export const mdContentAtom = atom({
  key: "mdContentAtom",
  default: {
    markid: null,
    title: "",
    content: "",
  },
});
export const mdErrorAtom = atom({
  key: "mdErrorAtom",
  default: {
    markid: "",
    title: "",
    content: "",
  },
});
export const mdValErrorAtom = atom({
  key: "mdValErrorAtom",
  default: {
    markid: "",
    title: "",
    content: "",
  },
});

export const updateLoadingAtom = atom({
  key: "updateLoading1Atom",
  default: false,
});
