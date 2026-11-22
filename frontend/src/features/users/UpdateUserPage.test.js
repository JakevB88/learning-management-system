import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../../app/AuthContext";
import UpdateUserPage from "./UpdateUserPage";
import "@testing-library/jest-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

beforeEach(() => {
    window.alert = jest.fn();
});

beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn()
        // PATCH update
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                username: "updateduser"
            })
        });
});

describe("validate UpdateUsersPage", () => {
    it("renders the update user form", () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ user: {id:1, role: "admin"} }}>
                    <UpdateUserPage />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: /Update/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
        expect(screen.getByLabelText("Username")).toBeInTheDocument();
        expect(screen.getByLabelText("eMail")).toBeInTheDocument();
        expect(screen.getByText("Role: admin")).toBeInTheDocument();
    });

});

describe("UpdateUserPage", () => {

    it("updates user account", async () => {
        //arrange
        render(
            <MemoryRouter>
                <AuthContext.Provider
                    value={{user: {
                        id: 1,
                        username: "testuser",
                        first_name: "John",
                        last_name: "Smith",
                        email: "john@test.com",
                        role: "student",
                    }}}
                >
                    <UpdateUserPage />
                </AuthContext.Provider>
            </MemoryRouter>
        );
        
        //wait for the form to render
        const usernameInput = await screen.findByLabelText("Username");
        
        //act
        //clear the input for username
        await userEvent.clear(usernameInput);

        //type the new username
        await userEvent.type(usernameInput,"updateduser");

        //submit the updated form
        await userEvent.click(screen.getByRole("button", {name: "Update Account"}));

        //assert
        expect(fetch).toHaveBeenCalledTimes(1);
        
        expect(fetch).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/api/users/1/update",
            expect.objectContaining({
                method: "PATCH",
            })
        );
        expect(mockNavigate).toHaveBeenCalledWith("/profile");

        expect(
            JSON.parse(
                fetch.mock.calls[0][1].body
            ).username)
        .toBe("updateduser");
    });
});  
    
