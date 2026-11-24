import { getCourses } from "./courseServices";
import { getCourse } from "./courseServices";
import { deregisterFromCourse } from "./courseServices";
import { registerToCourse } from "./courseServices";

describe("getCourses", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        global.fetch = jest.fn();
    });

    it("returns courses when request is successful", async () => {
        const mockCourses = [
            { id: 1, title: "React" },
            { id: 2, title: "Django" },
        ];

        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockCourses,
        });

        const result = await getCourses();

        expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:8000/api/courses",{method: "GET",});

        expect(result).toEqual(mockCourses);
    });

    it("throws an error when request fails", async () => {
        fetch.mockResolvedValue({
            ok: false,
            json: async () => ({
                error: "Database unavailable",
            }),
        });

        await expect(getCourses()).rejects.toThrow(
            "Database unavailable"
        );
    });

    it("throw default error when no error message returned", async () => {
        fetch.mockResolvedValue({
            ok: false,
            json: async () => ({}),
        });

        await expect(getCourses()).rejects.toThrow("Failed to fetch courses");
    });
});

describe("getCourse", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        global.fetch = jest.fn();
    });

    jest.mock("react-router-dom", () => ({
        ...jest.requireActual("react-router-dom"),
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: "1" }),
    }));

    it("return course when request is successful", async () => {
        const mockCourse = { 
            id: 1, title: "React" 
        };

        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockCourse,
        });

        const result = await getCourse(1);
        expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:8000/api/courses/1");
        expect(result).toEqual(mockCourse);
    });

    it("throw an error when request fails", async () => {
        fetch.mockResolvedValue({
            ok: false,
            json: async () => ({
                error: "Database unavailable",
            }),
        });

        await expect(getCourse()).rejects.toThrow(
            "Database unavailable"
        );
    });

    it("throw default error when no error message returned", async () => {
        fetch.mockResolvedValue({
            ok: false,
            json: async () => ({}),
        });

        await expect(getCourse()).rejects.toThrow("Failed to fetch course.");
    });
});


describe("registerToCourse", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        global.fetch = jest.fn();
        Storage.prototype.getItem = jest.fn(() => "fake-token");
    });

    it("registers to course successfuly", async () => {
        const mockResponse = {message: "Successfully registered",};

        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await registerToCourse(1);

        expect(fetch).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/api/courses/1/register",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer fake-token",
                },
            }
        );

        expect(result).toEqual(mockResponse);
    });


    it("throw an error when request fails", async () => {
        fetch.mockResolvedValue({
            ok: false,
            json: async () => ({
                error: "Database unavailable",
            }),
        });

        await expect(registerToCourse()).rejects.toThrow(
            "Database unavailable"
        );
    });

    it("throw default error when no error message returned", async () => {
        fetch.mockResolvedValue({
            ok: false,
            json: async () => ({}),
        });

        await expect(registerToCourse()).rejects.toThrow("Failed to register to course.");
    });
});


describe("deregisterToCourse", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        global.fetch = jest.fn();
        Storage.prototype.getItem = jest.fn(() => "fake-token");
    });

    it("deregisters to course successfuly", async () => {
        const mockResponse = {message: "Successfully deregistered",};

        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await deregisterFromCourse(1);

        expect(fetch).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/api/courses/1/deregister",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer fake-token",
                },
            }
        );

        expect(result).toEqual(mockResponse);
    });


    it("throw an error when request fails", async () => {
        fetch.mockResolvedValue({
            ok: false,
            json: async () => ({
                error: "Database unavailable",
            }),
        });

        await expect(deregisterFromCourse()).rejects.toThrow(
            "Database unavailable"
        );
    });

    it("throw default error when no error message returned", async () => {
        fetch.mockResolvedValue({
            ok: false,
            json: async () => ({}),
        });

        await expect(deregisterFromCourse()).rejects.toThrow("Failed to deregister from course.");
    });
});

