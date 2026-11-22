import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../../app/AuthContext";
import AdminUpdateUserPage from "./AdminUpdateUserPage";
import { getUser } from "../../services/userServices";
import "@testing-library/jest-dom";

const mockNavigate = jest.fn();
jest.mock("../../services/userServices");
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "1" }),
}));

beforeEach(() => {
    window.alert = jest.fn();
});

beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    getUser.mockResolvedValue({
        id: 1,
        username: "testuser",
        first_name: "John",
        last_name: "Smith",
        email: "john@test.com",
        role: "student",
    });
    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
            username: "updateduser",
    }),
});
});

describe("validate AdminUpdateUsersPage", () => {
    it("renders the update user form", async() => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ user: {id:5, role: "admin"} }}>
                    <AdminUpdateUserPage />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: /Update/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
        expect(screen.getByLabelText("Username")).toBeInTheDocument();
        expect(screen.getByLabelText("eMail")).toBeInTheDocument();
        expect(screen.getByText("Role")).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Delete User",})).toBeInTheDocument();
    });

});

describe("AdminUpdateUserPage", () => {

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
                    <AdminUpdateUserPage />
                </AuthContext.Provider>
            </MemoryRouter>
        );
        
        //wait for the form to render
        await screen.findByDisplayValue("testuser");
        const usernameInput = await screen.findByLabelText("Username");
    
        //act
        //clear the input for username
        await userEvent.clear(usernameInput);

        //type the new username
        await userEvent.type(usernameInput,"updateduser");

        //submit the updated form
        await userEvent.click(screen.getByRole("button", {name: "Update User"}));

        //assert
        
        expect(fetch).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/api/users/1/update",
            expect.objectContaining({
                method: "PATCH",
            })
        );

        expect(
            JSON.parse(
                fetch.mock.calls[0][1].body
            ).username)
        .toBe("updateduser");
    });
});  
    
