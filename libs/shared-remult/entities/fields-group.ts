import { Entity, EntityOptions, Fields, Validators } from 'remult';
import { BaseEntity } from './types';
import { entityBaseOptions } from '../utils/entity-base-options';


@Entity('fieldsGroups', entityBaseOptions, (options: EntityOptions) => {
  if (FieldsGroup.applyOptions) {
    FieldsGroup.applyOptions(options);
  }
})
export class FieldsGroup extends BaseEntity {
  @Fields.uuid()
  id!: string;

  @Fields.string()
  tenant: string = '';

  @Fields.string({
    validate: Validators.required,
  })
  name = '';

  @Fields.number()
  priority = 0;

  @Fields.string()
  description = '';

  @Fields.createdAt()
  createdAt = new Date;

  @Fields.updatedAt()
  updatedAt = new Date;
}