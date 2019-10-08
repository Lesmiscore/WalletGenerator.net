const constant = sm => sm;

const proportional = (moduleCount, sizeMultiplier) => ({
  mode: "proportional",
  moduleCount,
  sizeMultiplier
});

const calculateFinalSizeMultiplier = (sizeMultiplier, moduleCount) => {
  if (sizeMultiplier === null || sizeMultiplier === undefined) {
    // default
    return 2;
  } else if (typeof sizeMultiplier === "number") {
    // constant
    return sizeMultiplier;
  } else if (typeof sizeMultiplier === "object" && sizeMultiplier.mode === "proportional") {
    // proportional
    return (sizeMultiplier.sizeMultiplier * moduleCount) / sizeMultiplier.moduleCount;
  }
};

module.exports = {
  constant,
  proportional,
  calculateFinalSizeMultiplier
};
