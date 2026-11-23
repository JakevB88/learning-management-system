import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../../app/AuthContext";
import CoursesPage from "./CoursesPage";
import { getCourses } from "../../services/courseServices";
import "@testing-library/jest-dom";

//mock the get courses
jest.mock("../../services/courseServices");

//mock the displaycourses
jest.mock("../courses/DisplayCourse", () => {
    return function MockDisplayCourse({ courses }) {
        return (
            <div data-testid="display-courses">
                {courses.length} courses
            </div>
        );
    };
});

describe("Render CoursesPage layout", () => {
    beforeEach(() => {
        getCourses.mockResolvedValue([
            {
                id: 1,
                title: "Python",
                teacher_id: 2,
                students: [1],
            },
        ]);
    });

    it("renders Courses Layout", async () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider
                    value={{
                        user: {
                            id: 1,
                            username: "johno",
                            first_name: "John",
                            last_name: "Wild",
                            email: "johnwild@jvbcourses.com",
                            role: "student",
                        },
                    }}
                >
                    <CoursesPage />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", {name: "Courses",})).toBeInTheDocument();
        expect(screen.getByText("Summary of the courses available")).toBeInTheDocument();
        expect(await screen.findByTestId("display-courses")).toBeInTheDocument();

    });

    it("renders teacher courses page", async () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider
                    value={{
                        user: {
                            id: 2,
                            role: "teacher",
                        },
                    }}
                >
                    <CoursesPage />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByRole("button", {name: "Add course",})).toBeInTheDocument();
    });

    it("renders admin courses page", async () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider
                    value={{
                        user: {
                            id: 3,
                            role: "admin",
                        },
                    }}
                >
                    <CoursesPage />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByRole("button", {name: "Add course",})).toBeInTheDocument();
    });
});