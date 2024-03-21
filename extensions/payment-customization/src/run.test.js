import { describe, it, expect } from 'vitest';
import { run } from './run';

/**
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

describe('payment customization function', () => {
  it('returns no operations without configuration', () => {
    const result = run({
      paymentCustomization: {
        metafield: null
      }
    });
    const expected = /** @type {FunctionRunResult} */ ({ operations: [] });

    expect(result).toEqual(expected);
  });
});