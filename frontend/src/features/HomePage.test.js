import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from "react-router-dom"
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import HomePage from './HomePage';
import { Provider} from 'react-redux';
import store from '../store/store'
//Mock pages to test routing and layout

jest.mock("../features/QuestionsPage", () => () => <div>Questions Page</div>);

//group the test for App.js together using "describe"
describe("HomePage routing and layout", () => {
    it("render HomePage and check content", () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByRole("heading", { name: /Quiz Topics/i })    ).toBeInTheDocument(); //test to see the header h1 is rendered correctly

        expect(screen.getByText("Volcanoes")).toBeInTheDocument();
        expect(screen.getByText("Weather")).toBeInTheDocument();
        expect(screen.getByText("Solar-System")).toBeInTheDocument();
        expect(screen.getByText("Body")).toBeInTheDocument();
    });

  

    it("navigates to QuestionsPage when volcano image is clicked", async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/questionspage" element={<div>Questions Page</div>} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Match the image by accessible name (alt text)
        const volcanoImg = screen.getByRole("img", {name: /errupting volcano/i,});
        await user.click(volcanoImg);

        expect(screen.getByText("Questions Page")).toBeInTheDocument();
    });
    

    it("navigates to QuestionsPage when weather image is clicked", async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/questionspage" element={<div>Questions Page</div>} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Match the image by accessible name (alt text)
        const weatherImg = screen.getByRole("img", {name: /stromcloud hit by the light/i,});
        await user.click(weatherImg);

        expect(screen.getByText("Questions Page")).toBeInTheDocument();
    });

    it("navigates to QuestionsPage when solar image is clicked", async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/questionspage" element={<div>Questions Page</div>} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Match the image by accessible name (alt text)
        const solarImg = screen.getByRole("img", {name: /solarsystem/i,});
        await user.click(solarImg);

        expect(screen.getByText("Questions Page")).toBeInTheDocument();
    });

    it("navigates to QuestionsPage when body image is clicked", async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/questionspage" element={<div>Questions Page</div>} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Match the image by accessible name (alt text)
        const bodyImg = screen.getByRole("img", {name: /anatomy of a humen/i,});
        await user.click(bodyImg);

        expect(screen.getByText("Questions Page")).toBeInTheDocument();
    });
    
});
