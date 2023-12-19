import { Entity, Fields, Validators } from 'remult';
import { FieldInPlan } from './types';
import { entityBaseOptions } from '../utils/entity-base-options';

@Entity('plans', entityBaseOptions)
export class Plan {
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