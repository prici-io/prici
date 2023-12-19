import { Entity, Fields, Validators } from 'remult';
import { FieldKind } from './types';
import { entityBaseOptions } from '../utils/entity-base-options';

const fieldKinds = new Set(Object.values(FieldKind))

@Entity('planFields', entityBaseOptions)
export class PlanField {
  @Fields.uuid()
  id!: string;

  @Fields.string()
  tenant: string = '';

  @Fields.string({
    validate: Validators.required,
  })
  name = '';

  @Fields.string({
    validate: ({ kind }: any) => {
      // @ts-ignore
      if (!(fieldKinds.has(kind))) {
        throw 'field kind must be one of ' + Array.from(fieldKinds)
      }
    }
  })
  kind = FieldKind.Number;
}