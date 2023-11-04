import { SetStateAction, Dispatch } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Threads from "../threads/Threads"
import { Create } from "../create/Create";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";


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

        // setTHreadsが呼ばれるまで待つ
        await waitFor(() => expect(setThreads).toHaveBeenCalled());

        // setThreadsが呼ばれた時の引数を確認
        expect(setThreads).toHaveBeenCalledWith({ threads: dataThreadMock });

        // threadsにデータがセットされた後の状態を再現
        render(
            <BrowserRouter>
                <Threads threads={dataThreadMock} setThreads={setThreads} />
            </BrowserRouter>
        );
        
        
        const textElement = await screen.findByText(/testTodo/i);
        screen.debug(textElement);
        expect(textElement).toBeInTheDocument();

    });

/*
    it('should be a button for create new thread', () => {
        render(
            <BrowserRouter>
                <Threads threads={threads} setThreads={setThreads} />
            </BrowserRouter>
        );
        const buttonElement = screen.getByRole('button', { name:'Create' });
        screen.debug(buttonElement);
        expect(buttonElement).toBeInTheDocument();
    });


    it('navigate from root to thread creation page', async () => {
        render(
            <BrowserRouter>
                <Threads threads={threads} setThreads={setThreads} />
            </BrowserRouter>
        );
        await userEvent.click(screen.getByRole("link", { name: "Create New" }));
        expect(screen.getByText(/create new thread/i)).toBeInTheDocument();
    });


    it('should be new thread after create a thread', async () => {
        render(
            <BrowserRouter>
                <Create threads={threads} setThreads={setThreads} />
            </BrowserRouter>
        );
        const inputElement = screen.getByPlaceholderText(/create new thread/i);
        await userEvent.type(inputElement, 'new thread created!!{enter}');
        screen.debug();
        await expect(screen.getByText(/new thread created!!/i)).toBeInTheDocument();
    });
     */
})