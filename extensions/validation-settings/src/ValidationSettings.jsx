import {
  reactExtension,
  useApi,
  Text,
  Box,
  FunctionSettings,
  Section,
  NumberField,
  BlockStack,
} from "@shopify/ui-extensions-react/admin";

// The target used here must match the target used in the extension's toml file (../shopify.extension.toml)
const TARGET = "admin.settings.validation.render";

export default reactExtension(TARGET, () => <ValidationSettings />);

function ValidationSettings() {
  // The useApi hook provides access to several useful APIs like i18n, data and saveMetafields.
  const { applyMetafieldChange, i18n } = useApi(TARGET);

  // Transform your state into metafields and send them back to the admin to batch the
  // changes together with the rest of merchant updates to the validation
  const handleOnChange = async () => {
    const results = await applyMetafieldChange({
      namespace: "my-namespace",
      key: "my-key",
      type: "updateMetafield",
      value: `{"value": "test"}`,
      valueType: "json",
    });

    if (results.type === "error") {
      console.log(results.message);
    }
  };

  const handleOnErrors = (errors) => {
    console.log(errors)
  }

  return (
    <FunctionSettings onError={handleOnErrors}>
      <BlockStack gap="large">
        <Section>
          <Box padding="base">
            <Text fontWeight="bold">{i18n.translate("helpText")}</Text>
          </Box>
        </Section>
        <Section>
          <Box padding="base">
            {/* Create a UI to allow merchants to provide configuration values for your validation */}
            <NumberField label="Set a number" onChange={handleOnChange} />
          </Box>
        </Section>
      </BlockStack>
    </FunctionSettings>
  );
}