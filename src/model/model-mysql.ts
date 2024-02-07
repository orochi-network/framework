import { EventEmitter } from 'events';
import { Knex } from 'knex';
import { Connector } from '../application/connector.js';
import { EModelLock } from '../interfaces/common.js';

export type TMysqlModelEvent = 'table-lock' | 'table-unlock';

export class ModelMySQL extends EventEmitter {
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

  public async lock(mode: EModelLock = EModelLock.write) {
    const result = await this.getKnex().raw(
      `LOCK TABLES ${this.tableName} ${mode}`
    );
    this.emit('table-lock', this.tableName, mode);
    return result;
  }

  public async unlock() {
    const result = await this.getKnex().raw('UNLOCK TABLES');
    this.emit('table-unlock', this.tableName);
    return result;
  }
}

export default ModelMySQL;
