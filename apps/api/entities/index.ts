import { EntityOptions, remult } from 'remult';
import { entities, FieldKind, FieldState } from '@prici/shared-remult';
import { AccountPlan, PlanField } from '@prici/shared-remult';
import { defaultTenant } from '../config';

AccountPlan.applyOptions = function(options: EntityOptions<AccountPlan>) {
  options.saving = async (entity, event) => {
    if (!(event.isNew && entity.plan)) {
      return;
    }

    const plan = entity.plan;
    const tenant = remult.user?.tenant || defaultTenant;

    const allFields = await remult
      .repo(PlanField)
      .find({ where: { id: { $in: plan.fields.map(f => f.fieldId) }, tenant } });

    const fieldsMap = allFields.reduce((map, field) => {
      map[field.id] = field;
      return map;
    }, {} as Record<string, PlanField>);

    entity.state = plan.fields.reduce((state, field) => {
      const planField: PlanField = fieldsMap[field.fieldId];

      const manualFieldState = state[field.fieldId] || {};

      if (planField?.kind === FieldKind.Boolean) {
        state[field.fieldId] = {
          targetLimit: field.value,
          kind: FieldKind.Boolean,
          currentValue: field.value as boolean,
        };
      } else if (planField?.kind === FieldKind.Number) {
        state[field.fieldId] = {
          targetLimit: field.value as number,
          kind: FieldKind.Number,
          currentValue: 0,
          canExceedLimit: field.canExceedLimit,
        };
      } else {
        state[field.fieldId] = {
          targetLimit: field.value as string,
          kind: FieldKind.String,
          currentValue: field.value,
        };
      }
      if (field.resetMode) {
        state[field.fieldId].resetMode = field.resetMode;
      }
      if (manualFieldState) {
        Object.assign(state[field.fieldId], manualFieldState);
      }
      return state;
    }, entity.state as Record<string, FieldState>);
  };
};


export const entitiesList = Object.values(entities);