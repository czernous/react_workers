import React, { useEffect, useState } from 'react';
import ConcurrentFetcherSingleton from '../data';

import workerScript from '../data/fetch-worker?worker&url'

const fetcher = ConcurrentFetcherSingleton({workerScript, workerName: "background-fetch-worker", maxConcurrency: 5});

console.log(workerScript)

const WorkerTest: React.FC = () => {
  const [data, _setData] = useState<any[]>([]);
  const [errors, _setErrors] = useState<string[]>([]);

  
    // Attach the message event listener
    fetcher.createWorkers()
    // Fetch some example data
    fetcher.enqueueTask({ url: 'https://jsonplaceholder.typicode.com/posts/1' });
    fetcher.enqueueTask({ url: 'https://jsonplaceholder.typicode.com/posts/2' });
    fetcher.enqueueTask({ url: 'https://jsonplaceholder.typicode.com/posts/3' });
    fetcher.enqueueTask({ url: 'https://jsonplaceholder.typicode.com/posts/4' });
    fetcher.enqueueTask({ url: 'https://jsonplaceholder.typicode.com/posts/5' });
    fetcher.enqueueTask({ url: 'https://jsonplaceholder.typicode.com/posts/6' });
    fetcher.enqueueTask({ url: 'https://jsonplaceholder.typicode.com/posts/7' });
    fetcher.enqueueTask({ url: 'https://jsonplaceholder.typicode.com/posts/8' });
    fetcher.enqueueTask({ url: 'https://jsonplaceholder.typicode.com/posts/9' });
    fetcher.enqueueTask({ url: 'https://jsonplaceholder.typicode.com/posts/10' });
  

  useEffect(() => {
    // const handleWorkerMessage = (event: MessageEvent) => {
    //   const { data, error } = event.data;
    //   if (error) {
    //     setErrors(prevErrors => [...prevErrors, error]);
    //   } else {
    //     setData(prevData => [...prevData, data]);
    //   }
    // };

    // const promises = Promise.all([
    //   fetch('https://jsonplaceholder.typicode.com/posts/4'),
    //   fetch('https://jsonplaceholder.typicode.com/posts/5'),
    //   fetch('https://jsonplaceholder.typicode.com/posts/6'),
    //   fetch('https://jsonplaceholder.typicode.com/posts/7')
    // ])

    // promises.then(resp => {
    //   console.log(resp)
    //   return resp.map(r => {
    //     return r.json()
    //   })
    // }).then(data => {
    //   data.map(d => d.then(dd => {
    //     console.log(dd)
    //   setData(prevData => [...prevData, dd]);
    //   }).catch(error=>  setErrors(prevErrors => [...prevErrors, error]))
    //   )
      
    // })

    // Clean up the event listeners
    return () => {
      fetcher.removeWorkers()
      console.log("workers: ", fetcher.workers)
    };
  }, []);


  return (
    <div>
      <h1>Fetched Data</h1>
      {data.map((item, index) => (
        <div key={index}>
          <pre>{JSON.stringify(item, null, 2)}</pre>
        </div>
      ))}
      <h1>Errors</h1>
      {errors.map((error, index) => (
        <div key={index} style={{ color: 'red' }}>
          {error}
        </div>
      ))}
    </div>
  );
};

export default WorkerTest;
