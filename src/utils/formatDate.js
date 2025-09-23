export const formatDate = (date) => {
  //   console.log(date);
  // 2024-10-04
  //   const newDate = new Intl.DateTimeFormat("en-GB", {
  //     day: "2-digit",
  //     month: "short",
  //     year: "numeric",
  //   }).format(new Date(date));
  const tempDate = date.split("-");
  let day = tempDate[2];
  let month = tempDate[1];
  let year = tempDate[0];
  return `${day}.${month}.${year.substring(2)}`;
};
