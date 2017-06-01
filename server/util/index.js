
export const getToday = () => {
  const
    date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    nine = 9,
    dayString = day < nine ? `0${String(day)}` : day,
    monthString = month < nine ? `0${String(month)}` : month;

  return `${dayString}.${monthString}.${year}`;
};

export const error = (msg) => {
  throw (msg || "Ceva nu a mers cum trebuia");
};
