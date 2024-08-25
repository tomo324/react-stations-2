import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Threads.css";

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
    if (threads.length === 0) {
      fetch("https://railway.bulletinboard.techtrain.dev/threads")
        .then((res) => res.json())
        .then((data) => setThreads(data))
        .catch((e) => setError(e));
    }
  }, [threads, setThreads]);

  return error ? (
    <p className="error">Unable to fetch data</p>
  ) : (
    <>
      <h3>Threads</h3>
      <Link to="threads/new" className="link">
        Create New Thread
      </Link>
      <ul className="thread-list">
        {threads.map((thread) => (
          <li key={thread.id} className="thread-item">
            {thread.title}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Threads;
