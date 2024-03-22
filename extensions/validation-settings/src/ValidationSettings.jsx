import { useState } from "react";

import {
  reactExtension,
  useApi,
  Section,
  NumberField,
  Heading,
  Box,
  InlineStack,
  Text,
  BlockStack,
  Banner,
  Image,
  FunctionSettings,
} from "@shopify/ui-extensions-react/admin";

const TARGET = "admin.settings.validation.render";

export default reactExtension(TARGET, async (api) => {
  const { products, settings } = api.data.validation
    ? await getProductsAndValidation(api.data.validation.id)
    : {};

  return <ValidationSettings products={products} initialSettings={settings} />;
});

function ValidationSettings({ products, initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [error, setError] = useState(null);

  const { applyMetafieldChange } = useApi(TARGET);

  return (
    <FunctionSettings
      onError={(errors) => {
        setError(errors[0]?.message);
      }}
    >
      <Section heading="Validation Settings">
        {error && (
          <Banner title="Errors were encountered" dismissible tone="critical">
            <Box>{error}</Box>
          </Banner>
        )}

        <Box padding="base">
          {products.map(({ title, variants }) => {
            return (
              <BlockStack key={title}>
                <Box>
                  <Heading size={3}>{title}</Heading>
                </Box>
                <BlockStack>
                  {variants.map((variant) => {
                    const limit = settings[variant.id];

                    return (
                      <InlineStack inlineGap="large" key={variant.id}>
                        {variant.imageUrl && (
                          <Image
                            alt={variant.title}
                            source={variant.imageUrl}
                          />
                        )}
                        <Text>{variant.title}</Text>
                        <NumberField
                          value={limit}
                          min={0}
                          max={99}
                          label="Set a limit"
                          defaultValue={String(limit)}
                          onChange={async (value) => {
                            setError(null);
                            const newSettings = {
                              ...settings,
                              [variant.id]: value,
                            };

                            setSettings(newSettings);

                            const results = await applyMetafieldChange({
                              type: "updateMetafield",
                              namespace: "$app:my-validation-namespace",
                              key: "my-configuration-key",
                              value: JSON.stringify(newSettings),
                            });

                            if (results.type === "error") {
                              setError(results.message);
                            }
                          }}
                        />
                      </InlineStack>
                    );
                  })}
                </BlockStack>
              </BlockStack>
            );
          })}
        </Box>
      </Section>
    </FunctionSettings>
  );
}

async function getProductsAndValidation(validationId) {
  const [products, settings] = await Promise.all([
    getProducts(),
    validationId ? getValidation(validationId) : {},
  ]);

  return { products, settings };
}

async function getProducts() {
  const query = `#graphql
    query FetchProducts {
      products(first: 5) {
        nodes {
          title
          variants(first: 5) {
            nodes {
              id
              title
              image(maxHeight: 100) {
                url
              }
            }
          }
        }
      }
    }`;

  const results = await fetch("shopify:admin/api/graphql.json", {
    method: "POST",
    body: JSON.stringify({ query }),
  }).then((res) => res.json());

  return results?.data?.products?.nodes.map(({ title, variants }) => {
    return {
      title,
      variants: variants.nodes.map((variant) => ({
        title: variant.title,
        id: variant.id,
        imageUrl: variant?.image?.url,
      })),
    };
  });
}

async function getValidation(validationId) {
  const query = `#graphql
    query FetchValidation($validationId: ID!) {
      validation(id: $validationId) {
        metafields(first: 5, namespace: "$app:my-validation-namespace") {
          nodes {
            value
          }
        }
      }
    }`;

  const results = await fetch("shopify:admin/api/graphql.json", {
    method: "POST",
    body: JSON.stringify({
      query,
      variables: { validationId },
    }),
  }).then((res) => res.json());

  return JSON.parse(
    results.data.validation.metafields?.nodes?.[0]?.value ?? "{}",
  );
}
