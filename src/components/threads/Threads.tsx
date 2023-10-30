import { useEffect, useState } from "react";

export const Threads = () => {

    type Threads = {
        id: string,
        title: string
    }
    
    const [threads, setThreads] = useState<Threads[]>([]);

    useEffect(() => {
        fetch('https://railway.bulletinboard.techtrain.dev/threads')
        .then((res) => res.json())
        .then((data) => setThreads(data))
        .catch((error) => {
            console.error(error)
        })
    }, [])
        
    return (
      <>
        <ul>
            {threads.map((data) => (
                <li key={data.id}>{data.title}</li>
            ))}
        </ul>
      </>
    );
  }
  
  export default Threads;