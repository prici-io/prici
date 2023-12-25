import { Entity, EntityOptions, Fields, Validators } from 'remult';
import { BaseEntity, FieldInPlan } from './types';
import { entityBaseOptions } from '../utils/entity-base-options';

@Entity('plans', entityBaseOptions, (options: EntityOptions) => {
  if (Plan.applyOptions) {
    Plan.applyOptions(options);
  }
})
export class Plan extends BaseEntity {
  @Fields.uuid()
  id!: string;

  @Fields.string()
  tenant: string = '';

  @Fields.string()
  name = '';

  @Fields.string()
  description = '';

  @Fields.integer()
  priority = 1;

  @Fields.json()
  fields: Array<FieldInPlan> = []
}