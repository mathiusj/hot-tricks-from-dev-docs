import {
  Icon,
  InlineLayout,
  InlineStack,
  Link,
  Text,
  View,
  useShop,
} from "@shopify/ui-extensions-react/checkout";

export default function Extension() {
  const { storefrontUrl } = useShop();

  return (
    <InlineLayout
      blockAlignment="center"
      columns={["auto", "fill"]}
      accessibilityRole="navigation"
    >
      <InlineStack
        spacing="extraTight"
        blockAlignment="center"
        accessibilityRole="orderedList"
      >
        <InlineStack
          accessibilityRole="listItem"
          blockAlignment="center"
          spacing="extraTight"
        >
          <Link to={storefrontUrl}>Home</Link>
          <Icon source="chevronRight" size="extraSmall" />
        </InlineStack>
        <InlineStack
          accessibilityRole="listItem"
          blockAlignment="center"
          spacing="extraTight"
        >
          <Link to={new URL("/collections", storefrontUrl).href}>Shop</Link>
          <Icon source="chevronRight" size="extraSmall" />
        </InlineStack>
        <InlineStack accessibilityRole="listItem">
          <Text appearance="subdued">Checkout</Text>
        </InlineStack>
      </InlineStack>

      <InlineStack
        spacing="tight"
        inlineAlignment="end"
        accessibilityRole="orderedList"
      >
        <View accessibilityRole="listItem">
          <Link to={new URL("/sizing", storefrontUrl).href}>Sizing</Link>
        </View>
        <View accessibilityRole="listItem">
          <Link to={new URL("/terms", storefrontUrl).href}>Terms</Link>
        </View>
        <View accessibilityRole="listItem">
          <Link to={new URL("/privacy", storefrontUrl).href}>Privacy</Link>
        </View>
        <View accessibilityRole="listItem">
          <Link to={new URL("/faq", storefrontUrl).href}>FAQ</Link>
        </View>
        <View accessibilityRole="listItem">
          <Link to={new URL("/accessibility", storefrontUrl).href}>
            Accessibility
          </Link>
        </View>
      </InlineStack>
    </InlineLayout>
  );
}
