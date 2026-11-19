import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../app/AuthContext";
import HomePage from "./HomePage";

describe("Validate HomePage", () => {

    it("render then home page", () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider>
                    <HomePage />
                </AuthContext.Provider>
            </MemoryRouter>
        );


        expect(screen.getByRole("heading", {name: "Welcome to JvB Courses!"})).toBeInTheDocument();
        expect(screen.getByText(/At JvB Courses/i)).toBeInTheDocument();
    });
});