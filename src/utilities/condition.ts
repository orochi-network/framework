import { IModelCondition } from '../interfaces/common.js';

export class ConditionBuilder<T> {
  private cache: IModelCondition<T>[] = [];

  private currentField: keyof T = '' as keyof T;

  public static getInstance<T>() {
    return new ConditionBuilder<T>();
  }

  private newCondition(
    field: keyof T,
    operator: '>' | '<' | '<=' | '>=' | '=' | '!=',
    value: string | number | boolean
  ) {
    this.cache.push({
      field,
      operator,
      value,
    });
    return this;
  }

  public field(fieldName: keyof T) {
    this.currentField = fieldName;
    return this;
  }

  public not(value: string | number | boolean) {
    return this.newCondition(this.currentField, '!=', value);
  }

  public eq(value: string | number | boolean) {
    return this.newCondition(this.currentField, '=', value);
  }

  public gt(value: string | number | boolean) {
    return this.newCondition(this.currentField, '>', value);
  }

  public gte(value: string | number | boolean) {
    return this.newCondition(this.currentField, '>=', value);
  }

  public lt(value: string | number | boolean) {
    return this.newCondition(this.currentField, '<', value);
  }

  public lte(value: string | number | boolean) {
    return this.newCondition(this.currentField, '<=', value);
  }

  public invoke() {
    const temp = [...this.cache];
    this.cache = [];
    return temp;
  }
}

export default ConditionBuilder;
