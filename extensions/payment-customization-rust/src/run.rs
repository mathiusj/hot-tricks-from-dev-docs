use shopify_function::prelude::*;
use shopify_function::Result;

// The configured entrypoint for the 'purchase.payment-customization.run' extension target
#[shopify_function_target(query_path = "src/run.graphql", schema_path = "schema.graphql")]
fn run(input: input::ResponseData) -> Result<output::FunctionRunResult> {
    let no_changes = output::FunctionRunResult { operations: vec![] };

    // Get the cart total from the function input, and return early if it's below 100
    let cart_total: f64 = input.cart.cost.total_amount.amount.into();
    if cart_total < 100.0 {
        // You can use STDERR for debug logs in your function
        eprintln!("Cart total is not high enough, no need to hide the payment method.");
        return Ok(no_changes);
    }

    // Find the payment method to hide, and create a hide output operation from it
    // (this will be None if not found)
    let operations = input
        .payment_methods
        .iter()
        .find(|&method| method.name.contains(&"Cash on Delivery".to_string()))
        .map(|method| {
            vec![output::Operation::Hide(output::HideOperation {
                payment_method_id: method.id.to_string(),
            })]
        })
        .unwrap_or_default();

    // The shopify_function crate serializes your function result and writes it to STDOUT
    Ok(output::FunctionRunResult { operations })
}
