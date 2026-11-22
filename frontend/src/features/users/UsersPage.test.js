import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../../app/AuthContext";
import UsersPage from "./UsersPage";
import { getUsers } from "../../services/userServices";

jest.mock("../../services/userServices");
    
describe("validate UsersPage", () => {
    beforeEach(() => {
        getUsers.mockResolvedValue([]);
    });
    it("render the basic page layout", async () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ user: null }}>
                    <UsersPage />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();
        expect(screen.getByText("List of all users")).toBeInTheDocument();
        expect(screen.getByRole("table")).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Username" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
        expect(screen.queryByRole("columnheader", { name: "Role" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Add User" })).not.toBeInTheDocument();
    });

    it("renders admin page layout", () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ user: {role: "admin"} }}>
                    <UsersPage />
                </AuthContext.Provider>
            </MemoryRouter>
        );
        expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();
        expect(screen.getByText("List of all users")).toBeInTheDocument();
        expect(screen.getByRole("table")).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Role" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add User" })).toBeInTheDocument();
    });

    it("renders teaher page layout", () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ user: {role: "teacher"} }}>
                    <UsersPage />
                </AuthContext.Provider>
            </MemoryRouter>
        ); 
        expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument();
        expect(screen.getByText("List of all users")).toBeInTheDocument();
        expect(screen.getByRole("table")).toBeInTheDocument();
        expect(screen.queryByRole("columnheader", { name: "Role" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Add User" })).not.toBeInTheDocument();
    });

    it("renders returned users", async () => {
        getUsers.mockResolvedValue([
            {
                id: 1,
                username: "johno",
                first_name: "John",
                last_name: "Smith",
                role: "student",
            },
        ]);

        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ user: { role: "admin" } }}>
                    <UsersPage />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(await screen.findByText("johno")).toBeInTheDocument();
        expect(screen.getByText("John Smith")).toBeInTheDocument();
        expect(screen.getByText("student")).toBeInTheDocument();
    });
});
