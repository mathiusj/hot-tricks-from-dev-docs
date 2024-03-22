// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run({ cart, validation }) {
  /** @type {Array<{productVariantId: string; quantityLimit: number}>} */
  const configuration = JSON.parse(validation?.metafield?.value ?? "{}");

  const errors = cart.lines.reduce((acc, { quantity, merchandise }) => {
    if ("id" in merchandise) {
      const limit = configuration[merchandise.id] || Infinity;
      const title = merchandise.product.title;

      if (quantity > limit) {
        acc.push({
          localizedMessage: `Not possible to order more than ${quantity} of ${title}`,
          target: "cart",
        });
      }
    }

    return acc;
  }, []);

  return {
    errors,
  };
}
