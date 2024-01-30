import { DynamicModule, Module } from '@nestjs/common';
import { PriciService } from './prici.service';
import { INITIALIZE_CONFIG } from './constants';
import { PriciSdkOptions } from '../index';

@Module({})
export class PriciModule {
  static forRoot(options: PriciSdkOptions): DynamicModule {
    return {
      module: PriciModule,
      providers: [
        {
          provide: INITIALIZE_CONFIG,
          useValue: options,
        },
        PriciService,
      ],
      exports: [PriciService],
    };
  }
}
