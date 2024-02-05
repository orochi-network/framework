import * as changeCase from 'change-case';

export class Obj {
  public static toCamelCase(text: string): string {
    return changeCase.camelCase(text);
  }

  public static toSnakeCase(text: string): string {
    return changeCase.snakeCase(text);
  }

  public static toPascalCase(text: string): string {
    return changeCase.pascalCase(text);
  }

  public static objToCamelCase(obj: any): any {
    const entries = Object.entries(obj);
    const remap: any = {};
    for (let i = 0; i < entries.length; i += 1) {
      const [k, v] = entries[i];
      remap[Obj.toCamelCase(k)] = v;
    }
    return remap;
  }
}

export default Obj;
