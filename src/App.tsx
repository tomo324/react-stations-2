import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CreateThread } from "./components/threads/create/CreateThread";
import { NotFound } from "./components/NotFound";
import Threads from "./components/threads/Threads";

function App() {
  interface Thread {
    id: string;
    title: string;
  }

  const [threads, setThreads] = useState<Thread[]>([]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            index
            element={<Threads threads={threads} setThreads={setThreads} />}
          />
          <Route
            path="threads/new"
            element={<CreateThread threads={threads} setThreads={setThreads} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
