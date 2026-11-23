import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../../app/AuthContext";
import UserPage from "./UserPage";

//mock the useparams user id for the API request
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({ id: "1" }),
}));

//Mock backend response
beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
            id: 1,
            username: "testuser",
            first_name: "John",
            last_name: "Smith",
            email: "john@test.com",
            role: "student",
        }),
    });
});
    
describe("validate UserPage", () => {
    it("render user page layout", async () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ user: "teacher" }}>
                    <UserPage />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(await screen.findByText("testuser")).toBeInTheDocument();
        expect(screen.getByText("John")).toBeInTheDocument();
        expect(screen.getByText("Smith")).toBeInTheDocument();
        expect(screen.getByText("john@test.com")).toBeInTheDocument();
        expect(screen.getByText("student")).toBeInTheDocument();
    });


});
