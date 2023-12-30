import { Entity, EntityOptions, Fields, Validators } from 'remult';
import { BaseEntity, FieldKind } from './types';
import { entityBaseOptions } from '../utils/entity-base-options';

const fieldKinds = new Set(Object.values(FieldKind))

@Entity('planFields', entityBaseOptions, (options: EntityOptions) => {
  if (PlanField.applyOptions) {
    PlanField.applyOptions(options);
  }
})
export class PlanField extends BaseEntity {
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

  @Fields.createdAt()
  createdAt = new Date;

  @Fields.updatedAt()
  updatedAt = new Date;
}