import { describe, it, expect } from 'vitest';
import deliveryOptionGenerator from './index';

/**
 * @typedef {import("../generated/api").FunctionResult} FunctionResult
 */

describe('local pickup delivery option generator function', () => {
  it('returns a delivery option', () => {
    const result = deliveryOptionGenerator({
      cart: {
        lines: [
          {
            id: "gid://shopify/CartLine/1"
          }
        ]
      },
      fulfillmentGroups: [
        {
          handle:  "1",
          lines: [
            {
              id: "gid://shopify/CartLine/1"
            }
          ],
          deliveryGroup: {
            id: "gid://shopify/CartDeliveryGroup/1"
          },
          inventoryLocationHandles: ["2578303"]
        }
      ],
      locations: [
        {
          handle: "2578303",
          name: "Main St.",
          address: {
            address1: "123 Main St."
          }
        }
      ],
      deliveryOptionGenerator: {
        metafield: null
      }
    });
    const expected = /** @type {FunctionResult} */ ({
      operations: [
        {
          add: {
            title: "Main St.",
            cost: 1.99,
            pickupLocation: {
              locationHandle: "2578303",
              pickupInstruction: "Usually ready in 24 hours."
            },
          },
        },
      ]
    });

    expect(result).toEqual(expected);
  });
});