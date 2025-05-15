export const getUniqueId = (): number => {
  return Math.floor(Math.random() * Date.now());
};
