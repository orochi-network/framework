import { StringExt } from './string.js';

export class BytesBuffer {
  /**
   * None prefixed hex string
   */
  private tmpBuf: string = '';

  /**
   * Get instance of BytesBuffer
   * @deprecated Please use getInstance instead
   * @returns
   */
  public static newInstance(): BytesBuffer {
    return new BytesBuffer();
  }

  /**
   * Get instance of BytesBuffer
   * @returns
   */
  public static getInstance(): BytesBuffer {
    return new BytesBuffer();
  }

  public writeAddress(address: string): BytesBuffer {
    this.tmpBuf += StringExt.uintPadding(
      StringExt.hexPrefixRemove(address),
      160
    );
    return this;
  }

  public writeUint(
    uint: string | bigint | number,
    bitLen: number
  ): BytesBuffer {
    this.tmpBuf += StringExt.uintPadding(
      typeof uint === 'string'
        ? StringExt.hexPrefixRemove(uint)
        : uint.toString(16),
      bitLen
    );
    return this;
  }

  public writeBytes(bytes: string): BytesBuffer {
    this.tmpBuf += StringExt.toEvenHexString(StringExt.hexPrefixRemove(bytes));
    return this;
  }

  public writeFixedBytes(bytes: string, byteLen: number): BytesBuffer {
    this.tmpBuf += StringExt.bytesPadding(
      StringExt.hexPrefixRemove(bytes),
      byteLen
    );
    return this;
  }

  public invoke(): string {
    return StringExt.hexPrefixAdd(this.tmpBuf);
  }

  public flush() {
    this.tmpBuf = '';
  }
}

export default BytesBuffer;
