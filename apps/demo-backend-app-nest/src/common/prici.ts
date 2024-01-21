import { initialize } from "@prici/sdk";

export const priciSdk = initialize({
    priciUBaseUrl: process.env.PRICI_BASE_URL,
    token: process.env.PRICI_TOKEN
});

