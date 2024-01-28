import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { IsAllowedGuard, PriciService } from '@prici/sdk/nest';

const featureId = process.env.TODOS_FEATURE_ID as string;

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private priciService: PriciService,
  ) {}

  @Get('todos')
  getAllTodos() {
    console.log('priciService', this.priciService, this.priciService.sdk);
    return this.appService.getAllTodos();
  }

  @Post('todos')
  @UseGuards(
    IsAllowedGuard({
      errorMessage: 'User is out of quota',
      getAccountId: (_) => 'demo-account',
      getFieldId: (_) => featureId,
    }),
  )
  createTodo(@Body() body: any) {
    return this.appService.createTodo(body);
  }
}
