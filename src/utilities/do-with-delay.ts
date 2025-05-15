export const doWithDelay = (fn: () => void, delay: number) => {
  setTimeout(() => {
    fn();
  }, delay);
};
