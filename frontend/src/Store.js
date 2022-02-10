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

export function timeFormatting(time) {
  const day = time > 1440 ? Math.floor(time / 1440) : 0;
  const remain_time = time - day * 1440;
  const hour = remain_time > 60 ? Math.floor(remain_time / 60) : 0;
  const minute = remain_time - hour * 60;
  let time_text = null;
  if (day) {
    time_text = day + "일 " + hour + "시간 " + minute + "분";
  } else {
    time_text = hour + "시간 " + minute + "분";
  }

  return time_text;
}

export function make_comma(number) {
  if (!number) {
    return number;
  } else if (typeof number == "number") {
    const text = number.toLocaleString("en-US");
    return text;
  } else {
    return number;
  }
}
export function make_date(date, sep = "/") {
  if (date) {
    const date_text = String(date);
    const text =
      date_text.substring(0, 4) +
      sep +
      date_text.substring(4, 6) +
      sep +
      date_text.substring(6, 8);
    return text;
  } else {
    return date;
  }
}
export function slice_date(date) {
  if (date) {
    const date_text = String(date);
    const text = date_text.slice(0, 10);
    return text;
  } else {
    return date;
  }
}
