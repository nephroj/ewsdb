import { atom, selector } from "recoil";

// define atoms
export const isAuthAtom = atom({
  key: "isAuthAtom",
  default: false,
});

export const updateLoadingAtom = atom({
  key: "updateLoading1Atom",
  default: false,
});
