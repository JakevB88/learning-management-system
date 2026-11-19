import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../app/AuthContext";
import UsersPage from "./UsersPage";


    
describe("validate UsersPage", () => {
    it("renders the basic page layout", () => {
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
        expect(screen.getByRole("columnheader", { name: "ID" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Username" })).toBeInTheDocument();
        expect(screen.getByRole("columnheader", { name: "Email" })).toBeInTheDocument();
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
        expect(screen.getByRole("columnheader", { name: "Actions" })).toBeInTheDocument();
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
        expect(screen.queryByRole("columnheader", { name: "Actions" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Add User" })).not.toBeInTheDocument();
    });
});
