import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AuthContext from "./AuthContext";
import "@testing-library/jest-dom";
import App, { Sidebar, Layout, ProtectedRoute } from "./App"

//Mock pages to test routing and layout
jest.mock("../features/home/HomePage", () => () => <div>Home Page</div>);
jest.mock("../features/authentication/LoginPage", () => () => <div>Login Page</div>);
jest.mock("../features/courses/CoursesPage", () => () => <div>Courses Page</div>);
jest.mock("../features/users/CreateUserPage", () => () => <div>Create User Page</div>);

describe("validate sidebar rendering", () => {
  it("renders the basic sidebar layout", () => {
    render(

    <MemoryRouter>
      <AuthContext.Provider value={{ user: null }}>
        <Sidebar setMenuOpen={jest.fn()}/>
      </AuthContext.Provider>
    </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Courses" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });

  it("renders the admin sidebar layout", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: {role: "admin"} }}>
          <Sidebar setMenuOpen={jest.fn()}/>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Courses" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Manage Users" })).toBeInTheDocument();
  });
    
  it("renders the teacher sidebar layout", () => {
    render(    
      <MemoryRouter>  
        <AuthContext.Provider value={{ user: {role: "teacher"} }}>
          <Sidebar setMenuOpen={jest.fn()}/>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Courses" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Users" })).toBeInTheDocument();
  });

  it("renders the student sidebar layout", () => {
    render(      
      <MemoryRouter>
        <AuthContext.Provider value={{ user: {role: "student"} }}>
          <Sidebar setMenuOpen={jest.fn()}/>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Courses" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Profile" })).toBeInTheDocument();
  });
});

describe("validate application button navigation", () => {
  it("navigates to Home page", async () => {
    //arrange
    render(<App />);
    //act
    await userEvent.setup().click(screen.getByRole("button", { name: "Home" }));
    //assert
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });
  
  it("navigates to Login page", async () => {
    //arrange
    render(<App />);
    //act
    await userEvent.setup().click(screen.getByRole("button", { name: "Log in" }));
    //assert
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("navigates to Sign Up page", async () => {
    //arrange
    render(<App />);
    //act
    await userEvent.setup().click(screen.getByRole("button", { name: "Sign up" }));
    //assert
    expect(screen.getByText("Create User Page")).toBeInTheDocument();
  });

  it("navigates to Courses page", async () => {
    //arrange
    render(<App />);
    //act
    await userEvent.setup().click(screen.getByRole("button", { name: "Courses" }));
    //assert
    expect(screen.getByText("Courses Page")).toBeInTheDocument();
  });
});

describe("validate header rendering", () => {
  it("shows logout button when authenticated", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: { role: "student" },
            setUser: jest.fn(),
          }}
        >
          <Layout />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
        screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();
  });
});



describe("validate protected routes", () => {
  it("redirects unauthenticated users", () => {
    render(
      //create fake protected route and mock a text that a non user can not get to
      <MemoryRouter initialEntries={["/protected"]}>
        <AuthContext.Provider value={{ user: null }}>
          <Routes>
            <Route path="/" element={<div>Courses</div>} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <div>Update user</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

      expect(screen.queryByText("Update user"))
          .not.toBeInTheDocument();

      expect(screen.getByText("Courses"))
          .toBeInTheDocument();
  });

  it("allows authorised users", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <AuthContext.Provider
          value={{ user: { role: "admin" } }}
        >
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content"))
        .toBeInTheDocument();
  });

  it("redirects users with incorrect role", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <AuthContext.Provider
          value={{ user: { role: "student" } }}
        >
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });
});