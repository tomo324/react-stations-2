import { SetStateAction, Dispatch } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Threads from "../threads/Threads"
import { Create } from "../create/Create";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, Routes, Route } from "react-router-dom";


describe('threadList', () => {

    interface Thread {
        id: string;
        title: string;
    }

    const dataThreadMock: Thread[] = [
        { id: '1', title: 'testTodo' },
        {id: '2', title: 'hello'}
    ];


    it('should render threads', async () => {
        // APIのモック
        global.fetch = jest.fn(() =>
            Promise.resolve({
                // 返すデータをオブジェクトに包む
                json: () => Promise.resolve({threads: dataThreadMock}),
            } as Response),
            );

        const setThreads = jest.fn();
        
        // threadsが空の状態を再現
        render(
            <BrowserRouter>
                <Threads threads={[]} setThreads={setThreads} />
            </BrowserRouter>
        );

        // setThreadsが呼ばれるまで待つ
        await waitFor(() => expect(setThreads).toHaveBeenCalled());

        // setThreadsが呼ばれた時の引数を確認
        expect(setThreads).toHaveBeenCalledWith({ threads: dataThreadMock });

        // threadsにデータがセットされた後の状態を再現
        render(
            <BrowserRouter>
                <Threads threads={dataThreadMock} setThreads={setThreads} />
            </BrowserRouter>
        );
        
        const textElement = await screen.findByText(/hello/i);
        expect(textElement).toBeInTheDocument();
    });



    it('should be a button for create new thread', () => {
        const setThreads = jest.fn();
        render(
            <BrowserRouter>
                <Threads threads={dataThreadMock} setThreads={setThreads} />
            </BrowserRouter>
        );
        const buttonElement = screen.getByRole('link', { name:'Create New Thread' });
        expect(buttonElement).toBeInTheDocument();
    });


    it('navigate from root to thread creation page', async () => {
        const setThreads = jest.fn();

        render(
            <BrowserRouter>
                <Routes>
                    <Route index element={<Threads threads={dataThreadMock} setThreads={setThreads} />} />
                    <Route path="create" element={<Create threads={dataThreadMock} setThreads={setThreads} />} />
                </Routes>
            </BrowserRouter>
        );

        // トップページからスレッド作成ページに遷移
        await userEvent.click(screen.getByRole("link", { name: "Create New Thread" }));
        expect(screen.getByPlaceholderText(/Thread Title/i)).toBeInTheDocument();

        // リセットするためにトップのページに戻る
        await userEvent.click(screen.getByRole("link", { name: "Back" }));
        expect(screen.getByText(/hello/i)).toBeInTheDocument();
    });


    it('should be a new thread after create a thread', async () => {
        let threads = dataThreadMock;
        const setThreads = (newThreads: Thread[] | ((prevThreads: Thread[]) => Thread[])) => {
            if (typeof newThreads === 'function') {
                threads = newThreads(threads);
            } else {
                threads = newThreads;
            }
        };
        render(
            <BrowserRouter>
                <Routes>
                    <Route index element={<Threads threads={threads} setThreads={setThreads} />} />
                    <Route path="create" element={<Create threads={threads} setThreads={setThreads} />} />
                </Routes>
            </BrowserRouter>
        );

        // トップページからスレッド作成ページに遷移
        await userEvent.click(screen.getByRole("link", { name: "Create New Thread" }));

        // スレッド作成ページでスレッドを作成
        const inputElement = screen.getByPlaceholderText(/Thread Title/i);
        await userEvent.type(inputElement, 'new thread created!!');

        // スレッド作成ページで作成ボタンを押す
        const submitButtonElement = screen.getByRole('button', { name: 'Create' });
        await userEvent.click(submitButtonElement);

        await waitFor(() => {
            expect(screen.getByText(/new thread created!!/i)).toBeInTheDocument();
        });
    });


    it('if a new thread is created, it should be in the thread list', async () => {
        let threads = dataThreadMock;
        const setThrads: React.Dispatch<React.SetStateAction<Thread[]>> = (newThreads) => {
            threads = newThreads instanceof Function ? newThreads(threads) : newThreads;
        };

        // スレッド作成ページをレンダリング
        render(
            <BrowserRouter>
                <Create threads={threads} setThreads={setThrads} />
            </BrowserRouter>
            );

        // スレッド作成ページでスレッドを作成
        const inputElement = await screen.findByPlaceholderText(/Thread Title/i);
        await userEvent.type(inputElement, 'new thread created!!');

        // スレッド作成ページで作成ボタンを押す
        const submitButtonElement = screen.getByRole('button', { name: 'Create' });
        await userEvent.click(submitButtonElement);

        // トップページをレンダリング
        render(
            <BrowserRouter>
                <Threads threads={threads} setThreads={setThrads} />
            </BrowserRouter>
            );

        // トップページに新しいスレッドがあることを確認
        expect(screen.getByText(/new thread created!!/i)).toBeInTheDocument();
    });

});