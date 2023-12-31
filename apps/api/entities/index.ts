import { EntityOptions, remult } from 'remult';
import { entities, FieldKind, FieldState } from '@prici/shared-remult';
import { AccountPlan } from '@prici/shared-remult/entities/account-plan';
import { PlanField } from '@prici/shared-remult/entities/plan-field';


AccountPlan.applyOptions = function (options: EntityOptions<AccountPlan>) {
  options.saving = async (entity, event) => {
    if (!(event.isNew && entity.plans.length)) {
      return;
    }

    const plans = entity.plans;

    const allUniqueFieldsIds = Array.from(new Set(plans.map(plan => plan.fields.map(f => f.fieldId)).flat()))

    const allFields = await remult
      .repo(PlanField)
      .find({ where: { id: { $in: allUniqueFieldsIds } } });

    const fieldsMap = allFields.reduce((map, field) => {
      map[field.id] = field;
      return map;
    }, {} as Record<string, PlanField>)

    entity.state = {
      ...plans.reduce((state, plan) => {
        return plan.fields.reduce((state, field) => {
          const planField: PlanField = fieldsMap[field.fieldId];

          const manualFieldState = state[field.fieldId] || {};

          if (planField?.kind === FieldKind.Boolean) {
            state[field.fieldId] = {
              targetLimit: field.value,
              kind: FieldKind.Boolean,
              currentValue: field.value as boolean
            }
          } else if (planField?.kind === FieldKind.Number) {
            state[field.fieldId] = {
              targetLimit: field.value as number,
              kind: FieldKind.Number,
              currentValue: 0
            }
          } else {
            state[field.fieldId] = {
              targetLimit: field.value as string,
              kind: FieldKind.String,
              currentValue: field.value
            }
          }
          if (manualFieldState) {
            Object.assign(state[field.fieldId], manualFieldState);
          }
          return state;
        }, state);
      }, {} as Record<string, FieldState>),
      ...entity.state,
    }
  }
}


export const entitiesList = Object.values(entities)