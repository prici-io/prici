import { EntityOptions, remult } from 'remult';

export const entityBaseOptions: Partial<EntityOptions> = {
  allowApiCrud: true,
  backendPrefilter: () => {
    return {
      tenant: remult.user?.tenant || '0'
    }
  }
}