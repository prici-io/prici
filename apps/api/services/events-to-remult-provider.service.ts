import { PriciEvent, registerToEvents } from './event-bus-provider.service';
import { IncrementFieldEvent } from '@prici/shared-remult/controllers/account-fields.controller';
import { AccountFieldsController } from '../controllers/account-fields.controller';
import remultApiProviderService from './remult-api-provider.service';
import { remult } from 'remult';
import { defaultTenant } from '../config';


export async function initEventBus() {

  const accountFieldsController = new AccountFieldsController()

  const api = await remultApiProviderService.ready;

  async function onEvent(event: PriciEvent) {
    if (event.type === 'incrementField') {
      const { accountId, fieldId, incrementAmount, tenant } = event as IncrementFieldEvent

      if (!accountId || !fieldId) {
        throw new Error('missing required fields')
      }

      await api.withRemult(undefined, async () => {
        remult.user = { id: '0', tenant: tenant || defaultTenant }
        await accountFieldsController.incrementField(accountId, fieldId, incrementAmount)
      })
    } else {
      throw new Error('event.type not supported')
    }
  }

  await registerToEvents(onEvent);
}