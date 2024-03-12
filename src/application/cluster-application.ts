import cluster, { Worker } from 'cluster';
import EventEmitter from 'events';

// Application type, payload is a function that returns a Promise<number>
export type TApplication = { payload: () => Promise<number> };

// ApplicationMetadata type, clusterName is a string
export type TApplicationMetadata = { clusterName: string };

/**
 * ApplicationPayload type
 * This type is a combination of Application and ApplicationMetadata
 */
export type TApplicationPayload = TApplication & TApplicationMetadata;

// ClusterApplication class
// This class is used to manage the cluster workers and their payloads
export class ClusterApplication extends EventEmitter {
  private workerMap: Map<string, TApplicationPayload> = new Map();

  private pidMap: Map<number, string> = new Map();

  private shutdown: boolean = false;

  private autoRestart: boolean = true;

  constructor(restartPolicy: boolean = true) {
    super();
    this.autoRestart = restartPolicy;
  }

  public add(app: TApplicationPayload): ClusterApplication {
    if (cluster.isPrimary) {
      this.emit('new', app.clusterName);
    }

    this.workerMap.set(app.clusterName, app);
    return this;
  }

  private restartWorker(pid: number, app?: TApplicationPayload) {
    if (pid < 0 && typeof app !== 'undefined') {
      const curWorker = cluster.fork({ clusterName: app.clusterName });
      if (typeof curWorker.process.pid !== 'undefined') {
        this.pidMap.set(curWorker.process.pid, app.clusterName);
      } else {
        this.emit(
          'error',
          new Error('ClusterApplication::restartWorker() invalid process id')
        );
      }
      return;
    }
    if (this.pidMap.has(pid)) {
      const clusterName = this.pidMap.get(pid)!;
      const curWorker = cluster.fork({ clusterName });
      if (typeof curWorker.process.pid !== 'undefined') {
        this.pidMap.set(curWorker.process.pid, clusterName);
        this.emit('restart', curWorker.process.pid, clusterName);
        this.pidMap.delete(pid);
      } else {
        this.emit(
          'error',
          new Error('ClusterApplication::restartWorker() invalid process id')
        );
      }
      return;
    }
    this.emit('error', new Error('Pid or payload is invalid'));
  }

  private startWorkers() {
    for (let appPayload of this.workerMap.values()) {
      this.restartWorker(-1, appPayload);
    }
  }

  public start() {
    if (cluster.isPrimary) {
      this.startWorkers();

      cluster.on('exit', (worker: Worker) => {
        if (!this.shutdown && this.autoRestart) {
          if (typeof worker.process.pid !== 'undefined') {
            this.restartWorker(worker.process.pid);
          } else {
            this.emit(
              'error',
              new Error('ClusterApplication::start() invalid process id')
            );
          }
        }
      });

      const handler = (signal: string) => {
        this.emit('exit', signal);
        this.shutdown = true;
        let workerList: Worker[] = [];
        if (
          typeof cluster !== 'undefined' &&
          typeof cluster.workers !== 'undefined'
        ) {
          workerList = <Worker[]>(
            Object.values(cluster.workers).filter(
              (e) => typeof e !== 'undefined'
            )
          );
          for (let i = 0; i < workerList.length; i += 1) {
            const worker = workerList[i];
            if (typeof worker !== 'undefined') {
              worker.kill(signal);
            }
          }
        }
        setInterval(() => {
          let isAllDead = true;
          for (let i = 0; i < workerList.length; i += 1) {
            const worker = workerList[i];
            if (typeof worker !== 'undefined') {
              isAllDead &&= worker.isDead();
            }
          }
          if (isAllDead) {
            process.exit(0);
          }
        }, 1000);
      };

      process.on('SIGTERM', handler);
      process.on('SIGINT', handler);
    } else {
      const { clusterName } = process.env;
      if (typeof clusterName !== 'undefined') {
        const appPayload = this.workerMap.get(clusterName);
        if (typeof appPayload !== 'undefined') {
          appPayload.payload().then((code) => {
            this.emit('exit', code);
          });
        } else {
          this.emit(
            'error',
            new Error('ClusterApplication::start() invalid payload')
          );
        }
      } else {
        this.emit(
          'error',
          new Error('ClusterApplication::start() invalid cluster name')
        );
      }
    }
  }
}

export default ClusterApplication;
