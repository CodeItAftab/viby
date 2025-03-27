import { differenceInDays, format, isToday, isYesterday } from "date-fns";

export const getFromattedDate = (date) => {
  if (!date) {
    console.log("date error", date);
    return "";
  }
  if (isToday(new Date(date))) {
    return "Today";
  } else if (isYesterday(new Date(date))) {
    return "Yesterday";
    // } else if (isThisWeek(new Date(date))) {
    //   return format(new Date(date), "EEEE");
  } else if (differenceInDays(new Date(), new Date(date)) < 7) {
    return format(new Date(date), "EEEE");
  } else {
    return format(new Date(date), "dd/MM/yyyy");
  }
};

export const getFromattedTime = (date) => {
  if (!date) {
    console.log("date error", date);
    return "";
  }
  if (isToday(date)) {
    return new Date(date).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else if (differenceInDays(new Date(), date) < 7) {
    return format(new Date(date), "EEEE");
  } else {
    return format(new Date(date), "dd/MM/yyyy");
  }
};
