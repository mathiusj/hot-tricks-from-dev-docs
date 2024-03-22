// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  let deliverableLineIds = [];

  // Find deliverable cart line ids of all products with the specific tag.
  for (const deliverableLine of input.cart.deliverableLines) {
    if (
      deliverableLine.merchandise.__typename == "ProductVariant" &&
      deliverableLine.merchandise.product.hasAnyTag
    ) {
      deliverableLineIds.push(deliverableLine.id);
    }
  }

  // Short-circuit and return no operations unless we have at least three tagged products.
  if (deliverableLineIds.length < 3) {
    return NO_CHANGES;
  }

  // Find the location representing our Ottawa store.
  let ottawaLocation = input.locations.find(
    (location) => location.name == "Ottawa Store",
  );

  // Short-circuit and return no operations if the fulfillment location does not exist.
  if (ottawaLocation === undefined) {
    return NO_CHANGES;
  }

  // Construct the operations, including our MustFulfillFrom fulfillment constraint.
  let operations = [
    {
      mustFulfillFrom: {
        deliverableLineIds: deliverableLineIds,
        locationIds: [ottawaLocation.id],
      },
    },
  ];

  // Return the operation.
  return { operations: operations };
}
