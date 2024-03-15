import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { DiscountProvider } from "../components/providers/DiscountProvider";
import { Provider as AppBridgeReactProvider } from "@shopify/app-bridge-react";

import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";

import { authenticate } from "../shopify.server";
import { useState } from "react";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  const url = new URL(request.url);

  return json({
    apiKey: process.env.SHOPIFY_API_KEY || "",
    host: url.searchParams.get("host") || "",
  });
};

export default function App() {
  const { apiKey, host } = useLoaderData<typeof loader>();
  const [config] = useState({ host, apiKey });

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <AppBridgeReactProvider config={config}>
        <DiscountProvider>
          <ui-nav-menu>
            <Link to="/app" rel="home">
              Home
            </Link>
            <Link to="/app/additional">Additional page</Link>
          </ui-nav-menu>
          <Outlet />
        </DiscountProvider>
      </AppBridgeReactProvider>
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
