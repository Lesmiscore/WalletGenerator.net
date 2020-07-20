export {};
module.exports = function <T>(lazyFunc: (...args: any[]) => T, ...extraParams: any[]): () => T {
  let value: T;
  //const extraParams = Array.prototype.slice.call(arguments, 1);
  return function () {
    if (!value) value = lazyFunc(...extraParams);
    return value;
  };
};
