import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import DisplayCourse from "./DisplayCourse";
import AuthContext from "../../app/AuthContext";
import "@testing-library/jest-dom";


const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

const mockCourse = [
    {
        id: 1,
        title: "JavaScript",
        description: "Learn JavaScript",
        teacher_id: 2,
        students: [3, 4],
    },
];



beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
            message: "Successfully registered",
        }),
    });

    window.alert = jest.fn();
    window.confirm = jest.fn(() => true);
});

describe("DisplayCourse page", () => {
    it("renders course information", () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider
                    value={{
                        user: {
                            id: 1,
                            role: "student",
                        },
                    }}
                >
                    <DisplayCourse courses={mockCourse} refreshCourses={jest.fn()}/>
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByText("JavaScript")).toBeInTheDocument();
        expect(screen.getByText("Learn JavaScript")).toBeInTheDocument();
        expect(screen.getByText("Students: 2")).toBeInTheDocument();
    });

    it("registers a student to a course", async () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider
                    value={{
                        user: {
                            id: 1,
                            role: "student",
                        },
                    }}
                >
                    <DisplayCourse courses={mockCourse} refreshCourses={jest.fn()} />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        await userEvent.click(screen.getByText("JavaScript"));

        expect(window.confirm).toHaveBeenCalledWith("Register to course: JavaScript?");
        expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:8000/api/courses/1/register",expect.objectContaining({
                method: "PUT",
            })
        );
        expect(window.alert).toHaveBeenCalledWith("Successfully registered");
    });

    it("navigates to update course page as admin", async () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider
                    value={{
                        user: {
                            id: 2,
                            role: "admin",
                        },
                    }}
                >
                    <DisplayCourse courses={mockCourse} refreshCourses={jest.fn()}/>
                </AuthContext.Provider>
            </MemoryRouter>
        );

        await userEvent.click(screen.getByText("JavaScript"));

        expect(mockNavigate).toHaveBeenCalledWith("/update-course/1");
    });
});