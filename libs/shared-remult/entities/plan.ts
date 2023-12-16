import { Entity, Fields } from 'remult';

@Entity('plans', {
  allowApiCrud: true
})
export class Plan {
  @Fields.uuid()
  id!: string;

  @Fields.string()
  name = '';

  @Fields.string()
  description = '';


  @Fields.integer()
  priority = 1;

  @Fields.object()
  fields = []
}