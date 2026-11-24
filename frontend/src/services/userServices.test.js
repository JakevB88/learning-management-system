import { getUser } from "./userServices";
import { getUsers } from "./userServices";

describe("getUsers", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        global.fetch = jest.fn();        
        Storage.prototype.getItem = jest.fn(() => "fake-token");
    });

    it("returns users when request is successful", async () => {
        const mockUsers = [
            { id: 1, username: "React", role: "student" },
            { id: 2, username: "Django", role: "teacher" },
        ];
        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockUsers,
        });

        const result = await getUsers();
        expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:8000/api/users",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer fake-token",
                },
            }
        );

        expect(result).toEqual(mockUsers);
    });

    it("throws an error when request fails", async () => {
        fetch.mockResolvedValue({
            ok: false,
            json: async () => ({
                error: "Database unavailable",
            }),
        });

        await expect(getUsers()).rejects.toThrow(
            "Database unavailable"
        );
    });

    it("throw default error when no error message returned", async () => {
        fetch.mockResolvedValue({
            ok: false,
            json: async () => ({}),
        });

        await expect(getUsers()).rejects.toThrow("Failed to fetch all users.");
    });
});

describe("getUser", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        global.fetch = jest.fn();
        Storage.prototype.getItem = jest.fn(() => "fake-token");
    });

    it("returns user when request is successful", async () => {
        const mockUser = {
            id: 1,
            username: "React",
            role: "student",
        };

        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockUser,
        });

        const result = await getUser(1);

        expect(fetch).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/api/users/1",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer fake-token",
                },
            }
        );

        expect(result).toEqual(mockUser);
    });


    it("throws an error when request fails", async () => {
        fetch.mockResolvedValue({
            ok: false,
            json: async () => ({
                error: "Database unavailable",
            }),
        });

        await expect(getUser()).rejects.toThrow(
            "Database unavailable"
        );
    });

    it("throw default error when no error message returned", async () => {
        fetch.mockResolvedValue({
            ok: false,
            json: async () => ({}),
        });

        await expect(getUser()).rejects.toThrow("Failed to fetch user.");
    });
});