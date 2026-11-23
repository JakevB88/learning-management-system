import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../../app/AuthContext";
import UpdateCourse from "./UpdateCoursePage";
import "@testing-library/jest-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useParams: () => ({
        id: "1",
    }),
}));

jest.mock("../../services/courseServices", () => ({
    getCourse: jest.fn().mockResolvedValue({
        id: 1,
        title: "JavaScript",
        description: "",
        students: [],
    }),
}));

beforeEach(() => {
    window.alert = jest.fn();
});

beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn()
        // PATCH update
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                username: "updateduser"
            })
        });
});

describe("validate UpdateCoursePage", () => {
    it("renders the update Course form", () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ user: {id:1, role: "admin"} }}>
                    <UpdateCourse />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByRole("heading", { name: /Manage Course/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/Course name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Course description/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Delete/i })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /registered to/i })).toBeInTheDocument();
    });

});

describe("UpdateCoursePage", () => {

    it("updates course", async () => {
        //arrange
        render(
            <MemoryRouter>
                <AuthContext.Provider
                    value={{user: {id: 1,role: "teacher",}}}
                >
                    <UpdateCourse />
                </AuthContext.Provider>
            </MemoryRouter>
        );
        
        //wait for the form to render
        const coursenameInput = await screen.findByLabelText(/Course name/i);
        
        //act
        //clear the input for username
        await userEvent.clear(coursenameInput);

        //type the new username
        await userEvent.type(coursenameInput,"updatedCourse");

        //submit the updated form
        await userEvent.click(screen.getByRole("button", {name: "Update Course"}));

        //assert
        expect(fetch).toHaveBeenCalledTimes(1);
                
        expect(fetch).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/api/courses/1/update",
            expect.objectContaining({
                method: "PATCH",
            })
        );
        expect(mockNavigate).toHaveBeenCalledWith("/courses");
        expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({
            title: "updatedCourse",
            description: ""
        });
    });
});  
    
