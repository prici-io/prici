import { Injectable, Inject } from '@nestjs/common';
import { INITIALIZE_CONFIG } from './constants';
import { PriciSdkOptions, initialize, PriciSdk } from '../index';

@Injectable()
export class PriciService {
  sdk: PriciSdk;
  constructor(@Inject(INITIALIZE_CONFIG) options: PriciSdkOptions) {
    this.sdk = initialize(options);
  }
}
