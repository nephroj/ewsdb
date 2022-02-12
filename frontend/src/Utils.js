import axios from "axios";

export async function setLogging(level, message) {
  try {
    const res = await axios({
      method: "post",
      url: "/api/setlogging/",
      data: {
        level: level,
        message: message,
      },
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    console.log(err.response.data);
  }
}

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
export function to_fixed(num, n) {
  if (num) {
    const fixed_num = num.toFixed(n);
    return fixed_num;
  } else {
    return num;
  }
}
