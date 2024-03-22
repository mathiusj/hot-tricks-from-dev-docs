// @ts-check

/**
 * @typedef {import("../generated/api").InputQuery} InputQuery
 * @typedef {import("../generated/api").FunctionResult} FunctionResult
 */

/**
 * @type {FunctionResult}
 */
const DELIVERY_OPTION = {
  operations: [
    {
      add: {
        title: "Main St.",
        cost: 1.99,
        pickupLocation: {
          locationHandle: "2578303",
          pickupInstruction: "Usually ready in 24 hours."
        }
      }
    }
  ],
};

export default /**
 * @param {InputQuery} input
 * @returns {FunctionResult}
 */
(input) => {
  const configuration = JSON.parse(
    input?.deliveryOptionGenerator?.metafield?.value ?? "{}"
  );

  return DELIVERY_OPTION;
};