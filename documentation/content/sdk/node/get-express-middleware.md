# `getExpressMiddleware` Function Documentation

The `getExpressMiddleware` function is a utility function that returns an Express middleware with customizable options. This middleware is particularly useful for integrating Prici SDK functionality into Express applications.

## Middleware Options

```javascript

const middlewareOptions = {
  sdk: // Your Prici SDK instance,
  fieldId: // Optional: The id of the field to be checked and potentially incremented,
  errorMessage: // Optional: Custom error message, defaults to 'payment required',
  incrementAmount: // Optional: The amount by which the field should be incremented if the state check passes,
  getAccountId?: // Optional: Returns account id associated with the current request
  getFieldId?: // Optional: Returns field id associated with the current request
  getError?: // Optional: Returns the error message should be sent in response, if not provided default message will be used
  getIncrementAmount?: // Optional: Returns the amount by which the field should be incremented.
};

```
## Example Usage

```javascript
import PriciSdk from 'prici-sdk';
import { FieldStateResult } from '@prici/shared-remult';
import { getExpressMiddleware, MiddlewareOptions } from '/path/to/prici/sdk/express';

// Create an instance of PriciSdk
const priciSdk = new PriciSdk();

// Define middleware options
const middlewareOptions: MiddlewareOptions = {
  sdk: priciSdk,
  fieldId: 'exampleFieldId',
  errorMessage: 'Example error message',
  incrementAmount: 5,
  getAccountId: async (req: any) => req.account?.id || req.user?.account || req.user?.tenant,
  getFieldId: async (req: any) => req.fieldId,
  getError: async (req?: any) => 'Example custom error message',
  getIncrementAmount: () => 10,
};

// Create the middleware function
const middleware = getExpressMiddleware(middlewareOptions);

// Use the middleware in your Express app
app.use(middleware);

```