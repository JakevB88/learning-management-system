import { useNavigate } from "react-router-dom";

export default function CoursesPage() {
    const navigate = useNavigate();

    return(
        <div className="loginpage">
            <h2>Courses</h2>
            <div className="quizzes">
                <p>Summary of the courses available</p>
            </div>
        </div>
    )
}