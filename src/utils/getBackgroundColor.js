const getBackgroundColor = (delivery_date) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const dueDate = new Date(delivery_date).setHours(0, 0, 0, 0);
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "#f8005380";
  } else if (diffDays <= 3) {
    return "#f7eb6cb0";
  } else {
    return "#92ea26a6";
  }
};

export default getBackgroundColor;
