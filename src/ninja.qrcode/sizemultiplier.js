export const constant = (sm) => sm;

export const proportional = (moduleCount, sizeMultiplier) => ({
  mode: "proportional",
  moduleCount,
  sizeMultiplier,
});

export const calculateFinalSizeMultiplier = (sizeMultiplier, moduleCount) => {
  if (sizeMultiplier === null || sizeMultiplier === undefined) {
    // default
    return 2;
  } else if (typeof sizeMultiplier === "number") {
    // constant
    return sizeMultiplier;
  } else if (typeof sizeMultiplier === "object" && sizeMultiplier.mode === "proportional") {
    // proportional
    return (sizeMultiplier.sizeMultiplier * sizeMultiplier.moduleCount) / moduleCount;
  }
};

export default {
  constant,
  proportional,
  calculateFinalSizeMultiplier,
};
