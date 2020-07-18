module.exports = function (lazyFunc) {
  let value;
  const extraParams = Array.prototype.slice.call(arguments, 1);
  return function () {
    if (!value) value = lazyFunc(...extraParams);
    return value;
  };
};
