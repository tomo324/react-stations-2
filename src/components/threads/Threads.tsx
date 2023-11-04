import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFromApi } from "../api";

interface Thread {
    id: string;
    title: string;
}

interface ThreadsProps {
    threads: Thread[];
    setThreads: React.Dispatch<React.SetStateAction<Thread[]>>;
}

export const Threads: React.FC<ThreadsProps> = ({ threads, setThreads }) => {

    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        // 初回マウント時のみ実行
        if (threads.length === 0) {
            fetch('https://railway.bulletinboard.techtrain.dev/threads')
            .then((res) => res.json())
            .catch((e) => e)
            .then((data) => setThreads(data))
            .catch((e) => setError(e))
        }
    }, [threads, setThreads]);


    return error ? (
        <p>Unable to fetch data</p>
    ) : (
      <>
        <Link to="Create">Create New Thread</Link>
        <ul>
            {threads.map((data) => (
                <li key={data.id}>{data.title}</li>
            ))}
        </ul>
      </>
    );
  }
  
  export default Threads;