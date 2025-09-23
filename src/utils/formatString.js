export const formatString = (name, limit = 20) => {
  return name.length > limit ? `${name.substring(0, limit)}...` : name;
};
