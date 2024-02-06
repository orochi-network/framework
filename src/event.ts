import { EventEmitter } from 'events';

export class FrameworkEventEmitter extends EventEmitter {
  private static instance: FrameworkEventEmitter | undefined;

  public static getInstance() {
    if (typeof FrameworkEventEmitter.instance === 'undefined') {
      FrameworkEventEmitter.instance = new FrameworkEventEmitter();
    }
    return FrameworkEventEmitter.instance;
  }
}

export const FrameworkEvent = FrameworkEventEmitter.getInstance();

export default FrameworkEvent;
