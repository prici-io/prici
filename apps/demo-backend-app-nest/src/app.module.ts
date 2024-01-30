import { Module } from '@nestjs/common';
import { PriciModule } from '@prici/sdk/nest';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PriciModule.forRoot({
      priciUBaseUrl: process.env.PRICI_BASE_URL,
      token: process.env.PRICI_TOKEN,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
