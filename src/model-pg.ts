import { EventEmitter } from 'events';
import { Knex } from 'knex';
import { Connector } from './connector';
import { EModelLock } from './interfaces';

export type TPgModelEvent = 'table-lock' | 'table-unlock';

export class ModelPg extends EventEmitter {
  public tableName: string;

  private knexInstance: Knex;

  constructor(tableName: string, dbInstanceName: string = '__default__') {
    super();
    this.tableName = tableName;
    this.knexInstance = Connector.getInstance(dbInstanceName);
  }

  protected async insertIgnore(
    queryBuilder: Knex.QueryBuilder
  ): Promise<Knex.QueryBuilder> {
    return this.getKnex().raw(
      queryBuilder.toString().replace(/insert/i, 'INSERT IGNORE')
    );
  }

  public getKnex(): Knex {
    return this.knexInstance;
  }

  public getDefaultKnex(): Knex.QueryBuilder {
    return this.knexInstance(this.tableName);
  }
}

export default ModelPg;
