# `getExpressMiddleware` Function Documentation

The `getExpressMiddleware` function is a utility function that returns an Express middleware with customizable options. This middleware is particularly useful for integrating Prici SDK functionality into Express applications.

## Usage

```javascript
const express = require('express');
const { getExpressMiddleware } = require('your-module');

const app = express();

const middlewareOptions = {
  sdk: // Your Prici SDK instance,
  fieldId: // Optional: Specify the fieldId,
  errorMessage: // Optional: Custom error message, defaults to 'reached limit',
  incrementAmount: // Optional: Specify the increment amount,
  // ... add other options as needed
};

const middleware = getExpressMiddleware(middlewareOptions);

app.use(middleware);