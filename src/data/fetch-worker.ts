
self.addEventListener('message', async event => {
    const { url } = event.data;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
      const data = await response.json();
      self.postMessage(data);
    } catch (error) {
        //@ts-expect-error
      self.postMessage({ error: error.message });
    }
  });
  