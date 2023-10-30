import { render, screen } from "@testing-library/react";
import Threads from "../threads/Threads"

describe('threadList', () => {
    const dataThreadMock = () =>
    new Promise((resolve) => {
        resolve({
            ok: true,
            status: 200,
            json: async () => [{ id: 1, title: 'testTodo' }, {id: 2, title: 'hello'}]
        })
    })

    it('should render threads', async () => {
        global.fetch = jest.fn().mockImplementation(dataThreadMock)
        render(<Threads />);
        const listElement = await screen.findByText(/Hello/i);
        screen.debug();
        expect(listElement).toBeInTheDocument();
    });
})