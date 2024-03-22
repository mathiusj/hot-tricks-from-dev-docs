// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run({ cart }) {
  const errors = cart.lines
    .filter(({ quantity }) => {
      return quantity > 1;
    })
    .map(() => ({
      localizedMessage: "Not possible to order more than 1",
      target: "cart",
    }));

  return {
    errors,
  };
}
