export type Task ={
    url: string
    options?: RequestInit
}

export type WorkerEvent = {
    data: any
    error: string
}

type BusyWorker = Worker & { busy?: boolean };

type SingletonClass<TClass, TClassProps> = {
    getInstance: (props: TClassProps) => TClass
} & TClass

type Props = {
    workerScript: string;
    workerName: string;
    maxConcurrency: number;
}
class ConcurrentFetcher {
    private static instance: ConcurrentFetcher;
    workers: BusyWorker[];
    workerScript: string;
    workerName: string;
    taskQueue: Task[];
    maxConcurrency: number;
  
    private constructor({workerScript, workerName, maxConcurrency = 5}: Props) {
        this.workerScript = workerScript;
        this.workerName = workerName;
        this.workers = [];
        this.taskQueue = [];
        this.maxConcurrency = maxConcurrency; // Maximum number of concurrent tasks
        this.createWorkers();
    }

    public static getInstance({workerScript, workerName, maxConcurrency = 5}: Props): ConcurrentFetcher {
        if (!ConcurrentFetcher.instance) {
          ConcurrentFetcher.instance = new ConcurrentFetcher({workerScript, workerName, maxConcurrency});
        }
        return ConcurrentFetcher.instance;
      }
  
    public createWorkers() {
      // Initialize Web Workers
      for (let i = 0; i < this.maxConcurrency; i++) {
        const worker: BusyWorker = new Worker(this.workerScript, {name: `${this.workerName}-${i+1}`}) as BusyWorker;
          
        worker.addEventListener('message', this.handleWorkerMessage.bind(this));
        worker.busy = false;
        this.workers.push(worker);
      }
    }

    public removeWorkers() {
        while (this.workers.length > 0) {
            const worker = this.workers.pop();
            if (worker) {
              worker.removeEventListener('message', this.handleWorkerMessage.bind(this));
              worker.terminate();
            }
        }
    }
    
  
    public enqueueTask(task: Task) {
      this.taskQueue.push(task);
      this.processTaskQueue();
    }
  
    private processTaskQueue() {
      while (this.taskQueue.length > 0 && this.getAvailableWorkers().length > 0) {
        const worker = this.getAvailableWorkers()[0];
        const task = this.taskQueue.shift();
        if (task) {
          worker.postMessage(task);
          worker.busy = true;
        }
      }
    }
  
    public getAvailableWorkers() {
      return this.workers.filter(worker => worker.busy !== true);
    }
  
    public handleWorkerMessage(event: MessageEvent<WorkerEvent>) {
      const { data } = event;
  
      if (data.error) {
        console.error('Worker error:', data.error);
      } else {
          // Process fetched data
          console.log('Worker data:', data);
          const date = new Date()
          console.log("Date: ",date.getMilliseconds())
      }
  
      // Mark worker as available
      const worker = event.currentTarget as BusyWorker;
      worker.busy = false;
  
      // Process next task
      this.processTaskQueue();
    }
}
  
const createSingleton = <TClassProps, TClass>(props: TClassProps, baseClass: TClass ) => Object.freeze((baseClass as SingletonClass<TClass, TClassProps>).getInstance(props))
  

const ConcurrentFetcherSingleton = (props: Props) => {
     return createSingleton<Props, ConcurrentFetcher>(props, ConcurrentFetcher as unknown as ConcurrentFetcher)
}

export default ConcurrentFetcherSingleton;
   