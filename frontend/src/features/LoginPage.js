import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    return(
        <div className="loginpage">
            <h2>Login</h2>
            <div className="quizzes">
                <p>username</p>
                <p>password</p>
                <p>No account? .... No issue, just create a student account for free, click here</p>
            </div>
        </div>
    )
}