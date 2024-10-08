import React, { FormEvent, useState, useId, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreateThread.css";

interface Thread {
  id: string;
  title: string;
}

interface CreateProps {
  threads: Thread[];
  setThreads: React.Dispatch<React.SetStateAction<Thread[]>>;
}

export const CreateThread: React.FC<CreateProps> = ({ setThreads }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");

  const handleNewThread = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const id = useId();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title === "") return;
    setThreads((threads) => [...threads, { id, title }]);
    setTitle("");
    navigate("/");
  };

  return (
    <div className="container">
      <h3>Create New Thread</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="add-thread">New Thread:</label>
        <input
          type="text"
          id="add-thread"
          value={title}
          placeholder="Thread Title"
          onChange={handleNewThread}
        />
        <button type="submit">Create</button>
      </form>

      <Link to="/" className="link">
        Back to top
      </Link>
    </div>
  );
};
