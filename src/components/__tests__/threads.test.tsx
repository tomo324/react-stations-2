import { SetStateAction, Dispatch } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Threads from "../threads/Threads"
import { Create } from "../create/Create";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";


describe('threadList', () => {

    const dataThreadMock = () =>
    new Promise((resolve) => {
        resolve({
            ok: true,
            status: 200,
            json: async () => [{ id: '1', title: 'testTodo' }, {id: '2', title: 'hello'}]
        })
    })

    interface Thread {
        id: string;
        title: string;
    }

    const threads: Thread[] = [];
    //const setThreads: Dispatch<SetStateAction<Thread[]>> = jest.fn();


    it('should render threads', async () => {

        global.fetch = jest.fn().mockImplementation(dataThreadMock);
        const mockSetThreads = jest.fn().mockImplementation((newThreads) => {
            threads.push(...newThreads);
        });

        render(
            <BrowserRouter>
                <Threads threads={threads} setThreads={mockSetThreads} />
            </BrowserRouter>
        );
        await waitFor(() => expect(mockSetThreads).toHaveBeenCalled());
        const textElement = await screen.findByText(/testTodo/i);
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