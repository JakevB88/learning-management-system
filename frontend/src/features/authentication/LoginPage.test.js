import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../../app/AuthContext";
import Login from "./LoginPage";

test("allows user to enter username and password", async () => {
    render(
        <AuthContext.Provider
            value={{
                setUser: jest.fn(),
                getCurrentUser: jest.fn(),
            }}
        >
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        </AuthContext.Provider>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(usernameInput, "testuser");
    await userEvent.type(passwordInput, "password123");

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("password123");
});