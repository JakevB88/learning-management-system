import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../../app/AuthContext";
import Login from "./LoginPage";

describe("Render login page", () => {
    it("allows user to enter username and password", async () => {
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
});

describe("Login", () => {
    it("logs in successfully", async () => {
        // Arrange
        const mockGetCurrentUser = jest.fn();

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                access: "access-token",
                refresh: "refresh-token",
            }),
        });

        Storage.prototype.setItem = jest.fn();

        render(
            <AuthContext.Provider
                value={{
                    getCurrentUser: mockGetCurrentUser,
                }}
            >
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </AuthContext.Provider>
        );

        // Act
        await userEvent.type(screen.getByLabelText(/username/i),"johno");
        await userEvent.type(screen.getByLabelText(/password/i),"password123");
        await userEvent.click(screen.getByRole("button", { name: /login/i }));

        // Assert
        expect(fetch).toHaveBeenCalled();
        expect(localStorage.setItem).toHaveBeenCalledWith("access_token","access-token");
        expect(localStorage.setItem).toHaveBeenCalledWith("refresh_token","refresh-token");
        expect(mockGetCurrentUser).toHaveBeenCalled();
    });

    it("shows error when login fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
            error: "Invalid username or password",
        }),
    });

    window.alert = jest.fn();

    render(
        <AuthContext.Provider
            value={{
                getCurrentUser: jest.fn(),
            }}
        >
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        </AuthContext.Provider>
    );

    await userEvent.type(screen.getByLabelText(/username/i),"johno");
    await userEvent.type(screen.getByLabelText(/password/i),"wrongpassword");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(window.alert).toHaveBeenCalledWith("Invalid username or password");
    });
});