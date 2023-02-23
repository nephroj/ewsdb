import { atom, selector, selectorFamily } from "recoil";
import axios from "axios";

// define atoms
export const isAuthAtom = atom({
  key: "isAuthAtom",
  default: false,
});

export const navMenuAtom = atom({
  key: "navMenuAtom",
  default: "",
});

export const simStatusAtom = atom({
  key: "simStatusAtom",
  default: {},
});

export const dataStatusAtom = atom({
  key: "dataStatusAtom",
  default: {},
});

export const updateLoadingAtom = atom({
  key: "updateLoading1Atom",
  default: false,
});

// Markdown 설정용
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

// export const loadSimSettings = selector({
//   key: "loadSimSettings",
//   get: async ({ get }) => {
//     const res = await axios({
//       method: "get",
//       url: "/api/simsettings/",
//       headers: {
//         Authorization: `Token ${localStorage.getItem("token")}`,
//       },
//     });
//     const results = res.data;
//     return results;
//   },
// });

// export const getAPILoadable = selectorFamily({
//   key: "getAPILoadable",
//   get:
//     (url) =>
//     async ({ get }) => {
//       const response = await axios({
//         method: "get",
//         url: url,
//         headers: {
//           Authorization: `Token ${localStorage.getItem("token")}`,
//         },
//       });
//       return response.data;
//     },
// });
