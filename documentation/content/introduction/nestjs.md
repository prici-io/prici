# NestJs Integration

## Getting Started
Create a new NestJs app.
```bash
nest new prici-nest
```

### Installing Dependencies
Install Prici's sdk.
```bash
npm install @prici/sdk
```

**Environment Variables (optional)**

If you need to manage environment variables in your project, you should either install `@nestjs/config` or a more general solution like `dotenv`.
```bash
npm install @nestjs/config
# or
npm install dotenv
```

### Setup
#### Environment variables (optional)
Create a `.env` file at the root folder, paste these in
and update the values.
```bash
# JWT Token to be used
# when sending requests
# to Prici service
PRICI_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnQiOiJkZWZhdWx0IiwiaWQiOiIxIn0.jSp5c6WCjtJ5E5c2325pWzMsaxpwDJnr6TcPcE2xTKA
# Prici service base URL
PRICI_BASE_URL=http://0.0.0.0:9000
```

#### Adding Prici To NestJs
Open `main.module.ts`, import `PriciModule` and add it to the array of imports
```typescript
...
import { PriciModule } from "@prici/sdk/nest";

@Module({
  imports: [
    PriciModule.forRoot({
      priciUBaseUrl: "" // required but can be omitted if PRICI_BASE_URL is set. Prici service base URL
      token: "" // required but can be omitted if PRICI_TOKEN is set. JWT token used when sending requests to Prici service
      defaultErrorMessage: "" // optional, default message for the guard
    }),
  ],

...
```

## Using the SDK
Open the controller/provider file you wish to use the SDK at and then import `PriciService` from `@prici/sdk/nest` 
Now you can inject `PriciService` using NestJs DI system and use the SDK.

```typescript
import { PriciService } from "@prici/sdk/nest";

@Controller()
export class AppController {
   constructor(private priciService: PriciService) {}
}
```

Full route example:

```typescript
const featureId = "f723c4be-99ad-40dd-bc47-9f7524c27cb5";

@Controller()
export class AppController {
    constructor(private appService: AppService, private priciService: PriciService) {
    }

    @Post("todos")
    async createTodo(@Body() body: any) {
        const state = await this.priciService.sdk.getFieldState('demo-account', featureId);
    
        if (!state.isAllowed) {
            throw new BadRequestException("limit reached");
        }
        const todo = this.appService.createTodo(body);

        this.priciService.sdk.incrementField('demo-account', featureId).catch()

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

To use this guard, first follow "Getting Started" and "Setup" sections of this guide
and then add these imports:
```typescript
import { UseGuards } from '@nestjs/common';
import { IsAllowedGuard } from "@prici/sdk/nest";
```

Now you can use the guard as a route guard.
```typescript
@Controller()
export class AppController {
    constructor(private appService: AppService) {
    }

    @Post("todos")
    @UseGuards(IsAllowedGuard())
    createTodo(@Body() body: any) {
        return this.appService.createTodo(body);
    }
}
```

### Guard Options
You can optionally pass an object to `IsAllowedGuard` with the following options:

```typescript
{
  sdk?: // A `PriciSdk` instance to be used instead of the default instance.
  fieldId?: // The id of the field to be checked and potentially incremented.
  errorMessage?: // Custom error message, defaults to 'payment required'.
  incrementAmount?: // The amount by which the field should be incremented if the state check passes.
  getAccountId?: // Returns account id associated with the current request
  getFieldId?: // Returns field id associated with the current request.
  getError?: // Returns the error message should be sent in response, if not provided default message will be used.
  getIncrementAmount?: // Returns the amount by which the field should be incremented.
}
```
