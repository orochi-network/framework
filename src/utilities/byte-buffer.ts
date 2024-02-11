import { StringExt } from './string.js';

export class BytesBuffer {
  /**
   * None prefixed hex string
   */
  private tmpBuf: string = '';

  public static newInstance(): BytesBuffer {
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
    bitLen: number = 256
  ): BytesBuffer {
    this.tmpBuf += StringExt.uintPadding(
      typeof uint === 'string'
        ? StringExt.hexPrefixRemove(uint)
        : uint.toString(16),
      bitLen
    );
    return this;
  }

  public writeBytes(bytes: string, byteLen: number = 32): BytesBuffer {
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
