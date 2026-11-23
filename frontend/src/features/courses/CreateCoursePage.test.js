import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CreateCoursePage from "./CreateCoursePage";
import AuthContext from "../../app/AuthContext";
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
            message: "Course created",
        }),
    });

    window.alert = jest.fn();
});

describe("CreateCoursePage", () => {
    it("renders Course form", () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider
                    value={{
                        user: {
                            id: 1,
                            role: "teacher",
                        },
                    }}
                >
                    <CreateCoursePage />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", {name: /Create Course/i})).toBeInTheDocument();
        expect(screen.getByLabelText(/Course name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Course description/i)).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Create Course",})).toBeInTheDocument();
    });

    it("creates a Course", async () => {
        render(
                        <MemoryRouter>
                <AuthContext.Provider
                    value={{
                        user: {
                            id: 1,
                            role: "teacher",
                        },
                    }}
                >
                    <CreateCoursePage />
                </AuthContext.Provider>
            </MemoryRouter>
        );
        //FILL OUT THE INFORMATION IN THE FORM
        await userEvent.type(screen.getByLabelText(/Course name/i),"JavaScript");
        await userEvent.type(screen.getByLabelText(/Course description/i),"Learn JavaScript");
        await userEvent.click(screen.getByRole("button", {name: "Create Course",}));

        //WAIT FOR THE RETURN 
        expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:8000/api/courses/create",expect.objectContaining({method: "POST",}));

        expect(
            JSON.parse(fetch.mock.calls[0][1].body)
        ).toEqual({
            title: "JavaScript",
            description: "Learn JavaScript",
            teacher: 1,
        });

        expect(mockNavigate).toHaveBeenCalledWith("/courses");
        expect(window.alert).toHaveBeenCalledWith("Course Created!");
    });
});