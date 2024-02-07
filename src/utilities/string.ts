import crypto from 'crypto';

export class StringExt {
  /**
   * Get bytes padding to fixed size, for bytes everything is
   * starting from the left side
   * @param input Input bytes as hex string
   * @param length Length in bytes = hexString.length / 2
   * @returns
   */
  public static bytesPadding(input: string, length: number): string {
    const tmp = StringExt.hexPrefixRemove(input);
    const hexStringLen = length * 2;
    return tmp.length > hexStringLen
      ? input.substring(0, hexStringLen)
      : tmp.padEnd(hexStringLen, '0');
  }

  /**
   * Get uint padding to fixed size, for uint everything is starting
   * from right side
   * @param input Input bytes as hex string
   * @param bitLen Length in bytes = hexString.length / 2
   * @returns
   */
  public static uintPadding(input: string, bitLen: number): string {
    if (bitLen % 8 !== 0) {
      throw new Error('Invalid bit length');
    }
    const tmp = StringExt.hexPrefixRemove(input);
    const hexStringLen = bitLen / 4;
    if (tmp.length > hexStringLen) {
      return input.substring(tmp.length - hexStringLen, tmp.length);
    }
    return input.padStart(hexStringLen, '0');
  }

  public static hexPrefixRemove(input: string): string {
    return StringExt.toEvenHexString(input.replace(/^0x/i, ''));
  }

  public static toEvenHexString(input: string): string {
    if (input.length % 2 === 0) {
      return input;
    }
    return `0${input}`;
  }

  public static isHexString(input: string): boolean {
    return /^0x(?:[0-9A-Fa-f]{2})+$/.test(input);
  }

  public static isPrefixedHexString(input: string): boolean {
    return /^0x([0-9A-Fa-f]{2})+$/.test(input);
  }

  public static isUnprefixedHexString(input: string): boolean {
    return /^([0-9A-Fa-f]{2})+$/.test(input);
  }

  public static hexPrefixAdd(input: string): string {
    if (/^0x/i.test(input)) {
      return input;
    }
    return input.length % 2 === 0 ? `0x${input}` : `0x0${input}`;
  }

  public static randomBytesHexString(size: number = 32): string {
    return `0x${crypto.randomBytes(size).toString('hex')}`;
  }

  public static randomUint256() {
    return StringExt.randomBytesHexString();
  }

  public static randomUint128() {
    return StringExt.randomBytesHexString(16);
  }

  public static stringToBytes(v: string, byteLen: number): string {
    const buf = Buffer.alloc(byteLen);
    buf.write(v);
    return `0x${buf.toString('hex')}`;
  }
}

export default String;
