import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AuthContext from "../app/AuthContext";
import "@testing-library/jest-dom";
import { Sidebar } from "./App"
import App from "./App";

//Mock pages to test routing and layout
jest.mock("../features/HomePage", () => () => <div>Home Page</div>);
jest.mock("../features/LoginPage", () => () => <div>Login Page</div>);
jest.mock("../features/CoursesPage", () => () => <div>Courses Page</div>);
jest.mock("../features/CreateUserPage", () => () => <div>Create User Page</div>);

describe("validate sidebar rendering", () => {
  it("renders the basic sidebar layout", () => {
    render(

    <MemoryRouter>
      <AuthContext.Provider value={{ user: null }}>
        <Sidebar />
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
          <Sidebar />
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
          <Sidebar />
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
          <Sidebar />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Courses" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Profile" })).toBeInTheDocument();
  });
});

describe("validate sidebar button navigation", () => {
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
