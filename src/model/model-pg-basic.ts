/* eslint-disable class-methods-use-this */
import { Knex } from 'knex';
import { ModelPg } from './model-pg.js';
import Pagination from './pagination.js';
import {
  IModelCondition,
  IPagination,
  IResponse,
} from '../interfaces/common.js';
import ConditionBuilder from '../utilities/condition.js';

export abstract class ModelPgBasic<T> extends ModelPg {
  protected abstract basicQuery(): Knex.QueryBuilder;

  get condition() {
    return ConditionBuilder.getInstance<T>();
  }

  constructor(tableName: string, dbInstanceName: string = '__default__') {
    super(tableName, dbInstanceName);
  }

  protected attachConditions(
    ik: Knex.QueryBuilder,
    conditions?: IModelCondition<T>[]
  ): Knex.QueryBuilder {
    if (
      typeof conditions !== 'undefined' &&
      Array.isArray(conditions) &&
      conditions.length > 0
    ) {
      for (let i = 0; i < conditions.length; i += 1) {
        const { field, operator, value } = conditions[i];
        switch (operator) {
          case '<=':
          case '>=':
          case '<':
          case '>':
            ik.where(field as string, operator, value);
            break;
          case '!=':
            ik.whereNot(field as string, value);
            break;
          default:
            ik.where(field as string, value);
            break;
        }
      }
    }
    return ik;
  }

  protected async getListByCondition<V>(
    query: Knex.QueryBuilder,
    pagination: IPagination = { offset: 0, limit: 20, order: [] }
  ): Promise<IResponse<V>> {
    return {
      success: true,
      result: await Pagination.pagination<V>(query, pagination),
    };
  }

  public async insert(data: Partial<T>[]): Promise<T[]> {
    return this.getDefaultKnex().insert(data).returning('*');
  }

  public async update(
    data: Partial<T>,
    conditions?: IModelCondition<T>[]
  ): Promise<T[]> {
    return this.attachConditions(
      this.getDefaultKnex().update(data),
      conditions
    ).returning('*');
  }

  public async forceUpdate(
    data: Partial<T>,
    conditions?: IModelCondition<T>[]
  ): Promise<T[]> {
    const [record] = await this.attachConditions(
      this.basicQuery(),
      conditions
    ).first();
    if (typeof record === 'undefined' || typeof conditions === 'undefined') {
      return this.insert([data]);
    }
    return this.update(data, conditions);
  }

  public async find(conditions?: IModelCondition<T>[]): Promise<T[]> {
    if (typeof this.basicQuery === 'undefined') {
      throw Error('Basic query was undefined');
    }
    return this.attachConditions(this.basicQuery(), conditions);
  }

  public async isExist<K extends keyof T, V = T[K]>(
    key: keyof T,
    value: V
  ): Promise<boolean> {
    const [result] = await this.getDefaultKnex()
      .count('*', { as: 'total' })
      .where(key, value as any);
    return typeof result !== 'undefined' && result.total > 0;
  }

  public async isNotExist<K extends keyof T, V = T[K]>(
    key: keyof T,
    value: V
  ): Promise<boolean> {
    return !(await this.isExist(key, value));
  }
}

export default ModelPgBasic;
