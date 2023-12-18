import { Entity, Fields, Validators } from 'remult';

export enum FieldKind {
  Boolean = 'boolean',
  Number = 'number',
  String = 'string'
}

@Entity('planFields', {
  allowApiCrud: true
})
export class PlanField {
  @Fields.uuid()
  id!: string;

  @Fields.string({
    validate: Validators.required,
  })
  tenant: string = '';

  @Fields.string({
    validate: Validators.required,
  })
  name = '';

  @Fields.string({
    validate: ({ kind }: any) => {
      // @ts-ignore
      if (!(Object.values(FieldKind).includes(kind))) {
        throw 'field kind must be one of ' + Object.values(FieldKind)
      }
    }
  })
  kind = FieldKind.Number;
}