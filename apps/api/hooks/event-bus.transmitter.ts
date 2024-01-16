import { PriciEvent, registerToEvents } from '../services/event-bus-provider.service';
import { IncrementFieldEvent } from '@prici/shared-remult/controllers/account-fields.controller';
import { AccountFieldsController } from '../controllers/account-fields.controller';

const accountFieldsController = new AccountFieldsController()

export async function onEvent(event: PriciEvent) {
  if (event.type === 'incrementField') {
    const { accountId, fieldId, incrementAmount } = event as IncrementFieldEvent

    if (!accountId || !fieldId) {
      throw new Error('missing required fields')
    }

    await accountFieldsController.incrementField(accountId, fieldId, incrementAmount)
  } else {
    throw new Error('event.type not supported')
  }
}

export async function initEventBus() {
  await registerToEvents(onEvent);
}