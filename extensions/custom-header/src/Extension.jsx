import {
  Image,
  View,
  Text,
  BlockStack,
} from "@shopify/ui-extensions-react/checkout";

export default function Extension() {
  return (
    <View padding="tight">
      <BlockStack spacing="extraTight" alignment="center">
        <Image
          source="https://placehold.co/200x60/f3f3f3/666666?text=Your+Store"
          alt="Store Logo"
          aspectRatio={3.3}
          maxInlineSize={100}
        />
        <Text size="small" emphasis="subdued">
          Secure Checkout
        </Text>
      </BlockStack>
    </View>
  );
}
