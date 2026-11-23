import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AdminCreateUserPage from "./AdminCreateUserPage";
import "@testing-library/jest-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
            message: "User created",
        }),
    });

    window.alert = jest.fn();
});

describe("CreateUserPage", () => {
    it("renders signup form", () => {
        render(
            <MemoryRouter>
                <AdminCreateUserPage />
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", {name: /Create user/i,})).toBeInTheDocument();
        expect(screen.getByLabelText("Username")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByLabelText("First name")).toBeInTheDocument();
        expect(screen.getByLabelText("Last name")).toBeInTheDocument();
        expect(screen.getByLabelText("eMail")).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Create User",})).toBeInTheDocument();
    });

    it("creates a user account", async () => {
        render(
            <MemoryRouter>
                <AdminCreateUserPage />
            </MemoryRouter>
        );
        //FILL OUT THE INFORMATION IN THE FORM
        await userEvent.type(screen.getByLabelText("Username"),"johno");
        await userEvent.type(screen.getByLabelText("Password"),"password123");
        await userEvent.type(screen.getByLabelText("First name"),"John");
        await userEvent.type(screen.getByLabelText("Last name"),"Smith");
        await userEvent.type(screen.getByLabelText("eMail"),"jmith@jvbcourses.com");
        await userEvent.click(screen.getByRole("button", {name: "Create User",}));

        //WAIT FOR THE RETURN 
        expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:8000/api/users/create-staff",expect.objectContaining({method: "POST",}));

        expect(
            JSON.parse(fetch.mock.calls[0][1].body)
        ).toEqual({
            username: "johno",
            password: "password123",
            first_name: "John",
            last_name: "Smith",
            email: "jmith@jvbcourses.com",
            is_staff: false,
            is_active: true,
            role: "student",
        });

        expect(mockNavigate).toHaveBeenCalledWith("/users");
    });
});