import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    return(
        <div className="homepage">
            <h2>Welcome</h2>
            <div className="quizzes">
                    <div className="quiz-item">
                        <p className="quizTitle">This application allows you to browse courses supplied by JvB Courses.</p>

                    </div>
            
            </div>
        </div>
    )
}