import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage";

describe("HomePage", () => {

    it("renders the welcome heading", () => {
        render(<HomePage />);

        const heading = screen.getByRole("heading", {
            name: "Welcome"
        });

        expect(heading).toBeInTheDocument();
    });

    it("renders the homepage description", () => {
        render(<HomePage />);

        //act
        const description = screen.getByText(
            "This application allows you to browse courses supplied by JvB Courses."
        );
        
        //assert
        expect(description).toBeInTheDocument();
    });

    });