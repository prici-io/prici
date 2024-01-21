import {Controller, Get, Post, Body, UseGuards} from '@nestjs/common';
import {AppService} from './app.service';
import PriciSdk from '@prici/sdk';
import {IsAllowedGuard} from "@prici/sdk/nest"
import * as process from "process";

const sdk = new PriciSdk({
    priciUBaseUrl: process.env.PRICI_BASE_URL,
    token: process.env.PRICI_TOKEN
});

const featureId = process.env.TODOS_FEATURE_ID as string;

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get("todos")
    getAllTodos() {
        return this.appService.getAllTodos();
    }

    @Post("todos")
    @UseGuards(new IsAllowedGuard({
        sdk,
        errorMessage: "User is out of quota",
        getAccountId: (_) => "demo-account",
        getFieldId: (_) => featureId
    }))
    createTodo(@Body() body: any) {
        return this.appService.createTodo(body);
    }
}
