const sort = {
  asc: 1,
  desc: -1
};
export const sorting = (variant) => {
  return sort[variant.toLowerCase()];
};