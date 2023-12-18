import { Entity, Fields, Validators } from 'remult';

@Entity('plans', {
  allowApiCrud: true
})
export class Plan {
  @Fields.uuid()
  id!: string;

  @Fields.string({
    validate: Validators.required,
  })
  tenant: string = '';

  @Fields.string()
  name = '';

  @Fields.string()
  description = '';

  @Fields.integer()
  priority = 1;

  @Fields.json()
  fields: Array<{fieldId: string }> = []
}