/* eslint-disable no-await-in-loop */
import { Knex } from 'knex';
import { Connector } from '../application/connector.js';

export type TTransactionCallback = (tx: Knex.Transaction) => Promise<void>;

export type TErrorCallback = (error: Error) => Promise<void>;

export class Transaction {
  private knexInstance: Knex;

  private stack: TTransactionCallback[] = [];

  private constructor(dbInstanceName: string = '__default__') {
    this.knexInstance = Connector.getInstance(dbInstanceName);
  }

  public static getInstance(
    dbInstanceName: string = '__default__'
  ): Transaction {
    return new Transaction(dbInstanceName);
  }

  public process(proc: TTransactionCallback): Transaction {
    if (proc.constructor.name !== 'AsyncFunction') {
      throw new Error('Callback must be async function');
    }
    this.stack.push(proc);
    return this;
  }

  public async exec(): Promise<{ success: boolean; error: Error | null }> {
    let success = false;
    let error = null;
    await this.knexInstance.transaction(async (tx: Knex.Transaction) => {
      try {
        for (let i = 0; i < this.stack.length; i += 1) {
          await this.stack[i](tx);
        }
        await tx.commit();
        success = true;
      } catch (e) {
        await tx.rollback();
        error = e;
      }
    });
    return { success, error };
  }
}

export default Transaction;
