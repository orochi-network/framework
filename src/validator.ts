export type TType =
  | "string"
  | "integer"
  | "float"
  | "array"
  | "boolean"
  | "object";

export interface IKeyValue {
  [key: string]: any;
}

export interface IPostProcessMethod {
  (v: any): any;
}

export interface IValidateMethod {
  (v: any): boolean;
}

export interface IField {
  name: string;
  require?: boolean;
  type: TType;
  enums?: any[];
  validator?: IValidateMethod;
  message?: string;
  defaultValue?: any;
  postProcess?: IPostProcessMethod;
}

function fieldsToMap(fields: IField[]): { [key: string]: IField } {
  const fieldMap: any = {};
  for (let i = 0; i < fields.length; i += 1) {
    const field = fields[i];
    fieldMap[field.name] = field;
  }
  return fieldMap;
}

function mapToFields(mapOfFields: { [key: string]: IField }): IField[] {
  return Object.entries(mapOfFields).map((v: [string, IField]) => v[1]);
}

export class Validator {
  private fields: IField[];

  constructor(...fields: IField[]) {
    this.fields = fields;
  }

  public getFields(): IField[] {
    return this.fields;
  }

  public merge(target: Validator): Validator {
    const currentMap = fieldsToMap(this.fields);
    const targetMap = fieldsToMap(target.getFields());
    const cachedMap = { ...targetMap, ...currentMap };
    return new Validator(...mapToFields(cachedMap));
  }

  private static string(val: any): string {
    return val.toString();
  }

  private static integer(val: any): number {
    return Number.parseInt(val, 10);
  }

  private static float(val: any): number {
    return Number.parseFloat(val);
  }

  private static object(val: any): any {
    return typeof val === "string" ? JSON.parse(val) : val;
  }

  private static array(val: any): any[] {
    return typeof val === "string" ? JSON.parse(val) : val;
  }

  private static boolean(val: any): boolean {
    return val === "true" || val === true;
  }

  public validate(object: any) {
    return this.validateObject(object);
  }

  private validateObject(object: any): IKeyValue {
    const result: IKeyValue = {};
    let fields: IField[] = [];
    fields = this.fields;
    for (let i = 0; i < fields.length; i += 1) {
      const {
        name,
        require,
        type,
        validator,
        message,
        enums,
        defaultValue,
        postProcess,
      } = fields[i];
      if (typeof object[name] !== "undefined") {
        // Basic parse value
        const value = Validator[type](object[name]);
        // Check value with defined validator
        if (typeof validator === "function" && !validator(value)) {
          throw new Error(
            `Field ${name} : ${message || "does not satisfy validator"}`
          );
        }
        // Check value is in enums
        if (
          typeof enums !== "undefined" &&
          Array.isArray(enums) &&
          !enums.includes(value)
        ) {
          throw new RangeError(`Field ${name} need to be in range ${enums}`);
        }
        // Assign value to validated result
        if (typeof postProcess === "function") {
          result[name] = postProcess(value);
        } else {
          result[name] = value;
        }
      } else if (typeof defaultValue !== "undefined") {
        // Field is required and have defaultValue
        result[name] = defaultValue;
      } else if (require && typeof defaultValue === "undefined") {
        // Field is required but don't have value or defaultValue
        throw new Error(`Field ${name} is required`);
      }
    }
    return result;
  }
}

export default Validator;
