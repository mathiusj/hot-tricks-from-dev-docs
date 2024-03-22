use run::input::InputCart as Cart;
use run::input::InputCartLinesMerchandise::ProductVariant;
use run::input::InputCartLinesMerchandiseOnProductVariant;
use run::output::CartOperation;
use run::output::ExpandOperation;
use run::output::ExpandedItem;
use shopify_function::prelude::*;
use shopify_function::Result;

#[shopify_function_target(query_path = "src/run.graphql", schema_path = "schema.graphql")]
fn run(input: input::ResponseData) -> Result<output::FunctionRunResult> {
    let cart_operations: Vec<CartOperation> = get_expand_cart_operations(&input.cart);

    Ok(output::FunctionRunResult {
        operations: cart_operations,
    })
}

// expand operation logic

fn get_expand_cart_operations(cart: &Cart) -> Vec<CartOperation> {
    let mut result: Vec<CartOperation> = Vec::new();

    for line in cart.lines.iter() {
        let variant = match &line.merchandise {
            ProductVariant(variant) => Some(variant),
            _ => None,
        };
        if variant == None {
            continue;
        }

        if let Some(merchandise) = &variant {
            let component_references: Vec<ID> = get_component_references(&merchandise);

            if component_references.is_empty()
            {
                continue;
            }

            let mut expand_relationships: Vec<ExpandedItem> = Vec::new();

            for reference in
                component_references.iter()
            {
                let expand_relationship: ExpandedItem = ExpandedItem {
                    merchandise_id: reference.clone(),
                    quantity: 1,
                    price: None,
                };

                expand_relationships.push(expand_relationship);
            }

            let expand_operation: ExpandOperation = ExpandOperation {
                cart_line_id: line.id.clone(),
                expanded_cart_items: expand_relationships,
                price: None,
                image: None,
                title: None,
            };

            result.push(CartOperation::Expand(expand_operation));
        }
    }

    return result;
}

fn get_component_references(variant: &InputCartLinesMerchandiseOnProductVariant) -> Vec<ID> {
    if let Some(component_reference_metafield) = &variant.component_reference {
        return serde_json::from_str(&component_reference_metafield.value).unwrap();
    }

    return Vec::new();
}
