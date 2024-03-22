import {
  BlockStack,
  reactExtension,
  Button,
  TextBlock,
  Divider,
} from "@shopify/ui-extensions-react/customer-account";

export default reactExtension(
  "customer-account.order-status.fulfillment-details.render-after",
  () => <CustomerFulfillmentDetailsDelivery />,
);

function CustomerFulfillmentDetailsDelivery() {
  return (
    <BlockStack>
      <Divider />
      <TextBlock>Tell us how we did for a chance to win 1000 points</TextBlock>
      <BlockStack maxInlineSize={150}>
        <Button appearance="monochrome" kind="secondary">
          Write a review
        </Button>
      </BlockStack>
    </BlockStack>
  );
}
