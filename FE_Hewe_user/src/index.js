import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import "animate.css";
import React from "react";
import { ConnectKitProvider } from "connectkit";
import ReactDOM from "react-dom/client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { Provider } from "react-redux";
import { WagmiProvider } from "wagmi";
import { config } from "./components/Web3Provider/Web3Provider";
import "../src/assets/theme/antd-customized.css";
import App from "./App";
import "./assets/scss/style.scss";
import store from "./redux/configStore";

const RECAPTCHA_KEY = "6LfUvdkpAAAAAMboMkIg6m_m5bFEGO5SSzvgV3K3";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <ConnectKitProvider theme="midnight">
        <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_KEY} language="en">
          <Provider store={store}>
            <App />
          </Provider>
        </GoogleReCaptchaProvider>
      </ConnectKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
