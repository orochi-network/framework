import fs from 'fs';
import Joi from 'joi';
import { parse } from 'dotenv';
import { Obj } from './utilities';

export class ConfigLoader {
  private envs: any;

  constructor(filepath: string, validators?: Joi.ObjectSchema) {
    if (fs.existsSync(filepath)) {
      // If file is exist load from file
      this.envs = Obj.objToCamelCase(parse(fs.readFileSync(filepath)));
    } else {
      // Otherwise load from process.env
      this.envs = Obj.objToCamelCase(process.env);
    }
    if (typeof validators !== 'undefined') {
      const result = validators.validate(this.envs);
      if (result.error) {
        throw new Error(result.error.message);
      }
      this.envs = result.value;
    }
  }

  public getConfig<T>(): T {
    return this.envs;
  }
}

export default ConfigLoader;
