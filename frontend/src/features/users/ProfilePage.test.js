import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../../app/AuthContext";
import ProfilePage from "./ProfilePage";
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

describe("Render ProfilePage layout", () => {
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

    it("renders student profile information", async () => {
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
                    <ProfilePage />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", {name: "Your Profile",})).toBeInTheDocument();
        expect(screen.getByText("johno")).toBeInTheDocument();
        expect(screen.getByText("John")).toBeInTheDocument();
        expect(screen.getByText("Wild")).toBeInTheDocument();
        expect(screen.getByText("johnwild@jvbcourses.com")).toBeInTheDocument();
        expect(screen.getByText("student")).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Manage Profile",})).toBeInTheDocument();
        expect(screen.getByRole("heading", {name: "Your courses",})).toBeInTheDocument();
        expect(await screen.findByTestId("display-courses")).toBeInTheDocument();
    });

    it("renders teacher profile information", async () => {
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
                    <ProfilePage />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", {name: "Your created courses",})).toBeInTheDocument();
    });

    it("renders admin profile information", async () => {
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
                    <ProfilePage />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", {name: "Your created courses",})).toBeInTheDocument();
    });
});