# NestJs Integration

## Getting Started
Create a new NestJs app.
```
nest new prici-nest
```

### Installing Dependencies
Install Prici's sdk.
```
npm install @prici/sdk
```

To use environment variables options, install dotenv as well.
```
npm install dotenv
```

### Setup
Create a `.env` file at the root folder, paste these in
and update the values.
```
# JWT Token to be used
# when sending requests
# to Prici service
PRICI_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnQiOiJkZWZhdWx0IiwiaWQiOiIxIn0.jSp5c6WCjtJ5E5c2325pWzMsaxpwDJnr6TcPcE2xTKA
#Prici service base URL
PRICI_BASE_URL=http://0.0.0.0:9000
```

Go to `main.ts` and at the top of the file add an import for dotenv.
```typescript
import "dotenv/config"
```

## Using the SDK
Create a new ts file within your folder structure
for creating and exporting a new SDK instance (e.g. `common/prici.ts`)
and paste the following code.
```typescript
import { initialize } from "@prici/sdk";

export const priciSdk = initialize({
    priciUBaseUrl: process.env.PRICI_BASE_URL,
    token: process.env.PRICI_TOKEN
});
```
Please note that passing the options object
is optional when using environment variables.

Open the controller/service file you intend to
use with the SDK and import the SDK instance.
```typescript
import { priciSdk } from "./common/prici";
```

Now you can use the SDK to check and update users plan limits.
```typescript
const featureId = process.env.TODOS_FEATURE_ID as string;

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Post("todos")
    async createTodo(@Body() body: any) {
        const state = await priciSdk.getFieldState('demo-account', featureId)
    
        if (!state.isAllowed) {
            throw new BadRequestException("limit reached");
        }
        const todo = this.appService.createTodo(body);
        priciSdk.incrementField('demo-account', featureId).catch()

        return todo;
    }
}
```

## Using Guards
Prici currently has one guard.

This guard is called `IsAllowedGuard` and its job is to
validate that a user has not reached its limit quota before
your route handler runs and if all is well, it will update
the new usage when sending the response back.

To use this guard, first follow all steps in this guide up
until importing the SDK instance in the controller file
and then add these imports
```typescript
import { UseGuards } from '@nestjs/common';
import { IsAllowedGuard } from "@prici/sdk/nest"
```

Now you can use the guard as a route guard
```typescript
const featureId = process.env.TODOS_FEATURE_ID as string;

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Post("todos")
    @UseGuards(new IsAllowedGuard({
        sdk: priciSdk, //required field
        errorMessage: "User is out of quota", //required field
        getAccountId: (_) => "demo-account",
        getFieldId: (_) => featureId
    }))
    createTodo(@Body() body: any) {
        return this.appService.createTodo(body);
    }
}
```
